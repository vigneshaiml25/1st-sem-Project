import React from 'react';
import { motion } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import VoiceInput from './VoiceInput';

export default function QuestionCard({ 
    question, 
    questionNumber, 
    totalQuestions, 
    answer, 
    onAnswerChange, 
    onNext, 
    isLast 
}) {
    const handleVoiceTranscript = (transcript) => {
        onAnswerChange(answer ? answer + ' ' + transcript : transcript);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl mx-auto"
        >
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 md:p-10 border border-white/20 shadow-2xl">
                {/* Progress indicator */}
                <div className="flex items-center gap-2 mb-8">
                    <span className="text-white/60 text-sm font-medium">
                        Question {questionNumber} of {totalQuestions}
                    </span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Question */}
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 leading-relaxed">
                    {question}
                </h2>

                {/* Answer input */}
                <div className="space-y-6">
                    <Textarea
                        value={answer}
                        onChange={(e) => onAnswerChange(e.target.value)}
                        placeholder="Type your answer or use the mic button to speak..."
                        className="min-h-[140px] bg-white/5 border-white/20 text-white placeholder:text-white/40 
                                   text-lg rounded-2xl resize-none focus:border-emerald-400/50 focus:ring-emerald-400/20
                                   transition-all duration-300"
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <VoiceInput 
                            onTranscript={handleVoiceTranscript}
                            disabled={false}
                        />

                        <Button
                            onClick={onNext}
                            disabled={!answer?.trim()}
                            className="h-14 px-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 
                                     hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold
                                     disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300
                                     shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                        >
                            {isLast ? (
                                <>
                                    <Check className="mr-2 h-5 w-5" />
                                    Complete Survey
                                </>
                            ) : (
                                <>
                                    Next Question
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}