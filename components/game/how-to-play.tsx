"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, Gamepad2, Timer, Trophy, Rabbit, PopcornIcon as Poop } from "lucide-react";

export default function HowToPlay() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-[#1E90FF]/80 backdrop-blur-sm text-white border-[#1E90FF]/40 hover:bg-[#1E90FF]/90">
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          遊び方
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl mb-3 sm:mb-4">遊び方</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-0.5 sm:mb-1 text-sm sm:text-base">操作方法</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                画面左の仮想ジョイスティックで移動できます。
                PCの場合は矢印キーやWASDキーでも操作可能です。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Timer className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">制限時間</h3>
              <p className="text-sm text-muted-foreground">
                制限時間内にウサギを捕まえましょう！
                うんこを拾うと2秒追加されます。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">スコア</h3>
              <p className="text-sm text-muted-foreground">
                ウサギを捕まえるまでの時間を競います。
                うんこを拾うと制限時間が延長されます。
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Rabbit className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">ウサギを追いかけよう</h3>
              <p className="text-sm text-muted-foreground">
                ウサギは近づくと逃げ出します。
                うまく追いかけて捕まえましょう！
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Poop className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">うんこを集めよう</h3>
              <p className="text-sm text-muted-foreground">
                ウサギが残していくうんこを拾うと、
                スコアと制限時間が追加されます！
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}