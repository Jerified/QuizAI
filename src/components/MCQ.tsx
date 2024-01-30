"use client";
import { Game, Question } from "@prisma/client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import { differenceInSeconds } from "date-fns";
import Link from "next/link";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import { checkAnswerSchema, endGameSchema } from "@/schemas/questions";
import { cn, formatTimeDelta } from "@/lib/utils";
import MCQCounter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { useToast } from "./ui/use-toast";
import {FaQuestionCircle} from 'react-icons/fa'

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [hasEnded, setHasEnded] = React.useState(false);
  const [stats, setStats] = React.useState({
    correct_answers: 0,
    wrong_answers: 0,
  });
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [now, setNow] = React.useState(new Date());
  const [answerStatus, setAnswerStatus] = React.useState(0)  
  const [choiceStatus, setChoiceStatus] = React.useState<string>("default")

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = React.useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { toast } = useToast();
  //ts-ignore
  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
      };
      const response = await axios.post(`/api/checkAnswer`, payload);
      return response.data;
    },
  });

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      const response = await axios.post(`/api/endGame`, payload);
      return response.data;
    },
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const handleNext = React.useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        
        console.log(isCorrect)
       
        if (isCorrect) {
            // setAnswerStatus(true)
          setStats((stats) => ({
            ...stats,
            correct_answers: stats.correct_answers + 1,
          }));
          toast({
            title: "Correct",
            description: "You got it right!",
            // variant: "success",
          });
        } else {
        //  setAnswerStatus(isCorrect)
          setStats((stats) => ({
            ...stats,
            wrong_answers: stats.wrong_answers + 1,
          }));
          toast({
            title: "Incorrect",
            description: "You got it wrong!",
            variant: "destructive",
          });
        }
        
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }

        console.log(game.questions[questionIndex + 1])
        // setAnswerStatus(game.questions[questionIndex + 1])
        // setTimeout(() => {
            setQuestionIndex((questionIndex) => questionIndex + 1);
            // setAnswerStatus(true)
            // setChoiceStatus("default");
        // }, 1000);
      },
    });
  }, [checkAnswer, questionIndex, game.questions.length, toast, endGame]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === "1") {
        setSelectedChoice(0);
      } else if (key === "2") {
        setSelectedChoice(1);
      } else if (key === "3") {
        setSelectedChoice(2);
      } else if (key === "4") {
        setSelectedChoice(3);
      } else if (key === "Enter") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);
   function formatTimeDelta(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const secs = Math.floor(seconds - hours * 3600 - minutes * 60);
    const parts = [];
    if (hours > 0) {
      parts.push(`${hours.toString().padStart(2, '0')}`);
    }
    if (minutes > 0) {
      parts.push(`${minutes.toString().padStart(2, '0')}`);
    }
    if (secs > 0) {
      parts.push(`${secs.toString().padStart(2, '0')}`);
    }
    return <div className='bg-white/50 flex rounded-sm text-black font-medium'>{parts.map(part => (
        <div className='flex items-center border-r px-3 py-2' key={part}>
          <div className='text-xl mr-1 '>{part}</div>
          {/* <Timer className='w-4 h-4' /> */}
        </div>
    ))}</div>
  }

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You Completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-2")}
        >
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="md:w-[80vw] max-w-4xl w-[90vw] mx-auto">
      <div className="fle justify-between items-center my-3">
        <div className="flex flex-col">
          {/* topic */}
          <p className='flex items-center justify-center text-xl'>
            <span className="text-slate-400">Topic</span> &nbsp;
            <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
              {game.topic}
            </span>
          </p>
        </div>
        <MCQCounter
          correct_answers={stats.correct_answers}
          wrong_answers={stats.wrong_answers}
        />
      </div>
      <div className='flex items-center justify-between'>
        <div className="flex gap-1 text-xl items-center my-4 text-black font-semibold bg-white/70 py-2 px-3 rounded-sm w-fit">
            <span className=""><FaQuestionCircle className='text-3xl text-black' /></span>
            <div className="mr-5 text-center flex gap-1">
            <div className='indent-2 text-white/60'><span className='text-black'>Question No.</span>{questionIndex + 1}</div>
            <div className="">
            <span className='indent-2'>of</span> {game.questions.length}
            </div>
        <div/>
        </div>
        </div>
        {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
      </div>
      <Card className="w-full mt-2 md:mt-4 bg-white text-black md:h-[15vh]">
        <CardHeader className="flex flex-row items-center">
          <CardDescription className="flex-grow text-lg">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        {options.map((option, index) => {
            console.log(option)
            // if (indent)
          return (
            <Button
              key={option}
              variant={selectedChoice === index ? "default" : "outline"}
              className={`justify-start w-full py-8 mb-4  border-2 rounded-md ${selectedChoice === answerStatus ? "bg-green-500" : "bg-red-500"}`}
            //   onClick={() => setSelectedChoice(index)}
            >
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-3 border rounded-md">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="text-start whitespace-pre-line">{option}</div>
              </div>
            </Button>
          );
        })}
        <Button
          variant="default"
          className="mt-2 flex justify-end items-end"
          size="lg"
          disabled={isChecking || hasEnded}
          onClick={() => {
            handleNext();
          }}
        >
          {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
