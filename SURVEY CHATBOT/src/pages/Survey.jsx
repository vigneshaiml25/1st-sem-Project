import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import VoiceInput from '../components/survey/VoiceInput';

export default function Survey() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const userType = urlParams.get('type') || 'employee';

  const [currentQuestionId, setCurrentQuestionId] = useState('q1');
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [questionCount, setQuestionCount] = useState(1);

  const allQuestions = getBranchingQuestions(userType);
  const currentQuestion = allQuestions[currentQuestionId];

  // Text-to-speech for questions
  useEffect(() => {
    if (currentQuestion && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Small delay to ensure clean speech
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        window.speechSynthesis.speak(utterance);
      }, 300);
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestionId]);

  function isPositiveResponse(answer, questionId) {
    const lowerAnswer = answer.toLowerCase().trim();
    
    // Check for numeric ratings (1-10)
    const numMatch = answer.match(/\d+/);
    if (numMatch) {
      const num = parseInt(numMatch[0]);
      if (num >= 1 && num <= 10) {
        return num >= 6; // 6+ is positive
      }
    }
    
    // Check for yes/no or positive/negative keywords
    const positiveWords = ['yes', 'good', 'great', 'excellent', 'satisfied', 'happy', 'love', 'effective', 'well', 'recommend', 'positive'];
    const negativeWords = ['no', 'bad', 'poor', 'unsatisfied', 'unhappy', 'hate', 'ineffective', 'difficult', 'not', "don't", 'negative'];
    
    const hasPositive = positiveWords.some(word => lowerAnswer.includes(word));
    const hasNegative = negativeWords.some(word => lowerAnswer.includes(word));
    
    if (hasPositive && !hasNegative) return true;
    if (hasNegative && !hasPositive) return false;
    
    // Default to positive for longer, detailed answers
    return answer.length > 20;
  }

  function getBranchingQuestions(type) {
    const questionSets = {
      employee: {
        q1: {
          id: 'q1',
          question: 'How would you rate your overall experience with our products? (1-10)',
          type: 'text',
          next: (answer) => isPositiveResponse(answer) ? 'q2_positive' : 'q2_negative'
        },
        q2_positive: {
          id: 'q2_positive',
          question: "That's great! Which features do you find most valuable in your daily work?",
          type: 'textarea',
          next: () => 'q3'
        },
        q2_negative: {
          id: 'q2_negative',
          question: 'We understand. What are the main challenges you face with our products?',
          type: 'textarea',
          next: () => 'q3'
        },
        q3: {
          id: 'q3',
          question: 'How effective is our product training and documentation? (1-10)',
          type: 'text',
          next: (answer) => isPositiveResponse(answer) ? 'q4_positive' : 'q4_negative'
        },
        q4_positive: {
          id: 'q4_positive',
          question: 'Excellent! How do you typically use the training resources?',
          type: 'textarea',
          next: () => 'q5'
        },
        q4_negative: {
          id: 'q4_negative',
          question: 'What improvements would make the training more helpful for you?',
          type: 'textarea',
          next: () => 'q5'
        },
        q5: {
          id: 'q5',
          question: 'Have you encountered any technical issues recently?',
          type: 'textarea',
          next: (answer) => isPositiveResponse(answer, 'q5') ? 'q6_negative' : 'q6_positive'
        },
        q6_positive: {
          id: 'q6_positive',
          question: 'Great! How well does the product integrate with your existing workflow? (1-10)',
          type: 'text',
          next: () => 'q7'
        },
        q6_negative: {
          id: 'q6_negative',
          question: 'Please describe the technical issues so we can address them.',
          type: 'textarea',
          next: () => 'q7'
        },
        q7: {
          id: 'q7',
          question: 'Would you recommend our products to colleagues? (1-10)',
          type: 'text',
          next: (answer) => isPositiveResponse(answer) ? 'q8_positive' : 'q8_negative'
        },
        q8_positive: {
          id: 'q8_positive',
          question: 'Thank you! What specific aspects would you highlight in your recommendation?',
          type: 'textarea',
          next: () => 'q9'
        },
        q8_negative: {
          id: 'q8_negative',
          question: 'What improvements would make you more likely to recommend us?',
          type: 'textarea',
          next: () => 'q9'
        },
        q9: {
          id: 'q9',
          question: 'How long have you been working with our products?',
          type: 'text',
          next: () => 'q10'
        },
        q10: {
          id: 'q10',
          question: 'Any final suggestions or feedback for our product team?',
          type: 'textarea',
          next: () => null
        }
      },
      stakeholder: {
        q1: {
          id: 'q1',
          question: 'How aligned are our products with current market demands? (1-10)',
          type: 'text',
          next: (answer) => isPositiveResponse(answer) ? 'q2_positive' : 'q2_negative'
        },
        q2_positive: {
          id: 'q2_positive',
          question: 'Excellent! Which product lines show the strongest market position?',
          type: 'textarea',
          next: () => 'q3'
        },
        q2_negative: {
          id: 'q2_negative',
          question: 'What market gaps should we prioritize addressing?',
          type: 'textarea',
          next: () => 'q3'
        },
        q3: {
          id: 'q3',
          question: 'How effective is our product innovation strategy? (1-10)',
          type: 'text',
          next: (answer) => isPositiveResponse(answer) ? 'q4_positive' : 'q4_negative'
        },
        q4_positive: {
          id: 'q4_positive',
          question: 'Great! What innovation areas should we expand further?',
          type: 'textarea',
          next: () => 'q5'
        },
        q4_negative: {
          id: 'q4_negative',
          question: 'What changes would strengthen our innovation approach?',
          type: 'textarea',
          next: () => 'q5'
        },
        q5: {
          id: 'q5',
          question: 'Do you see competitive advantages in our current product portfolio?',
          type: 'textarea',
          next: (answer) => isPositiveResponse(answer) ? 'q6_positive' : 'q6_negative'
        },
        q6_positive: {
          id: 'q6_positive',
          question: 'Which competitive advantages should we emphasize most?',
          type: 'textarea',
          next: () => 'q7'
        },
        q6_negative: {
          id: 'q6_negative',
          question: 'How can we better differentiate from competitors?',
          type: 'textarea',
          next: () => 'q7'
        },
        q7: {
          id: 'q7',
          question: 'How sustainable is our product roadmap for long-term growth? (1-10)',
          type: 'text',
          next: (answer) => isPositiveResponse(answer) ? 'q8_positive' : 'q8_negative'
        },
        q8_positive: {
          id: 'q8_positive',
          question: 'Which aspects of the roadmap are most promising?',
          type: 'textarea',
          next: () => 'q9'
        },
        q8_negative: {
          id: 'q8_negative',
          question: 'What strategic pivots should we consider?',
          type: 'textarea',
          next: () => 'q9'
        },
        q9: {
          id: 'q9',
          question: 'What emerging market trends should influence our product development?',
          type: 'textarea',
          next: () => 'q10'
        },
        q10: {
          id: 'q10',
          question: 'Any strategic recommendations for our product portfolio?',
          type: 'textarea',
          next: () => null
        }
      },
      customer: {
        q1: {
          id: 'q1',
          question: 'How satisfied are you with your purchase? (1-10)',
          type: 'text',
          next: (answer) => isPositiveResponse(answer) ? 'q2_positive' : 'q2_negative'
        },
        q2_positive: {
          id: 'q2_positive',
          question: "Wonderful! What do you love most about the product?",
          type: 'textarea',
          next: () => 'q3'
        },
        q2_negative: {
          id: 'q2_negative',
          question: 'We apologize for your experience. What disappointed you?',
          type: 'textarea',
          next: () => 'q3'
        },
        q3: {
          id: 'q3',
          question: 'How easy was the product to use? (1-10)',
          type: 'text',
          next: (answer) => isPositiveResponse(answer) ? 'q4_positive' : 'q4_negative'
        },
        q4_positive: {
          id: 'q4_positive',
          question: 'Great! Which features did you find most intuitive?',
          type: 'textarea',
          next: () => 'q5'
        },
        q4_negative: {
          id: 'q4_negative',
          question: 'What aspects were confusing or difficult?',
          type: 'textarea',
          next: () => 'q5'
        },
        q5: {
          id: 'q5',
          question: 'Did the product meet your expectations?',
          type: 'textarea',
          next: (answer) => isPositiveResponse(answer) ? 'q6_positive' : 'q6_negative'
        },
        q6_positive: {
          id: 'q6_positive',
          question: 'Excellent! How does it compare to similar products you\'ve tried?',
          type: 'textarea',
          next: () => 'q7'
        },
        q6_negative: {
          id: 'q6_negative',
          question: 'What features or improvements would have met your expectations?',
          type: 'textarea',
          next: () => 'q7'
        },
        q7: {
          id: 'q7',
          question: 'How likely are you to recommend our product? (1-10)',
          type: 'text',
          next: (answer) => isPositiveResponse(answer) ? 'q8_positive' : 'q8_negative'
        },
        q8_positive: {
          id: 'q8_positive',
          question: 'Thank you! Who would you recommend this product to?',
          type: 'textarea',
          next: () => 'q9'
        },
        q8_negative: {
          id: 'q8_negative',
          question: 'What would make you more likely to recommend us?',
          type: 'textarea',
          next: () => 'q9'
        },
        q9: {
          id: 'q9',
          question: 'How was your experience with our customer support? (1-10)',
          type: 'text',
          next: () => 'q10'
        },
        q10: {
          id: 'q10',
          question: 'Any final thoughts or suggestions for improvement?',
          type: 'textarea',
          next: () => null
        }
      }
    };

    return questionSets[type] || questionSets.employee;
  }

  const handleNext = () => {
    if (!currentAnswer.trim()) return;

    const newAnswers = { ...answers, [currentQuestionId]: currentAnswer };
    setAnswers(newAnswers);

    // Determine next question based on current answer
    const nextQuestionId = currentQuestion.next ? currentQuestion.next(currentAnswer) : null;
    
    if (nextQuestionId) {
      setCurrentQuestionId(nextQuestionId);
      setCurrentAnswer('');
      setQuestionCount(questionCount + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleBack = () => {
    // For simplicity, disable back navigation in branching mode
    // Could implement history tracking if needed
  };

  const handleSubmit = async (finalAnswers) => {
    setIsSubmitting(true);
    const completionTime = Math.floor((Date.now() - startTime) / 1000);

    const surveyData = {
      user_type: userType,
      responses: finalAnswers,
      completed: true,
      completion_time: completionTime
    };

    await base44.entities.SurveyResponse.create(surveyData);
    
    setTimeout(() => {
      navigate(createPageUrl('Home'));
    }, 2000);
  };

  const handleVoiceTranscript = (transcript) => {
    setCurrentAnswer(transcript);
  };

  const progress = (questionCount / 10) * 100;

  const userTypeLabels = {
    employee: 'Employee',
    stakeholder: 'Stakeholder',
    customer: 'Customer'
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mountain Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-slate-800/90 z-0" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-block bg-white/10 backdrop-blur-xl rounded-full px-6 py-2 mb-6">
              <span className="text-white font-medium">{userTypeLabels[userType]} Survey</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-white/70 mt-4 text-sm">
              Question {questionCount} of 10
            </p>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            {!isSubmitting ? (
              <motion.div
                key={currentQuestionId}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl"
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-8 leading-tight">
                  {currentQuestion.question}
                </h2>

                <div className="space-y-6">
                  {currentQuestion.type === 'textarea' ? (
                    <Textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="min-h-[150px] text-lg border-2 focus:border-blue-500 rounded-2xl p-4"
                      autoFocus
                    />
                  ) : (
                    <Input
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="text-lg border-2 focus:border-blue-500 rounded-2xl p-6"
                      autoFocus
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && currentAnswer.trim()) {
                          handleNext();
                        }
                      }}
                    />
                  )}

                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px bg-slate-300 flex-1" />
                    <span className="text-slate-500 text-sm font-medium">or speak</span>
                    <div className="h-px bg-slate-300 flex-1" />
                  </div>

                  <div className="flex justify-center">
                    <VoiceInput onTranscript={handleVoiceTranscript} />
                  </div>
                </div>

                <div className="flex justify-end items-center mt-8 pt-8 border-t border-slate-200">
                  <Button
                    onClick={handleNext}
                    disabled={!currentAnswer.trim()}
                    className="rounded-full px-8 py-6 text-base bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {questionCount === 10 ? (
                      <>
                        Submit
                        <CheckCircle className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl text-center"
              >
                <div className="mb-6">
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Submitting Your Survey
                </h3>
                <p className="text-slate-600">
                  Thank you for your valuable feedback!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}