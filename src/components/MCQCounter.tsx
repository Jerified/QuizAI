import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";

type Props = {
    correct_answers: number;
    wrong_answers: number;
};

const MCQCounter = ({ correct_answers, wrong_answers }: Props) => {
    return (
        <Card className="flex flex-row items-center justify-between p-2 bg-inherit border-none">
            <div className="flex flex-row items-center">
                <CheckCircle2 color="green" size={30} />
                <span className="mx-3 text-2xl text-[green]">{correct_answers}</span>
            </div>

            {/* <Separator orientation="vertical" /> */}

            <div className="flex flex-row items-center">
                <span className="mx-3 text-2xl text-[red]">{wrong_answers}</span>
                <XCircle color="red" size={30} />
            </div>
        </Card>
    );
};

export default MCQCounter;
