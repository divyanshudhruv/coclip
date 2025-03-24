"use client";
import Image from "next/image";
import { Auth } from "@/my-ui/auth";
import { DotPatternDemo } from "@/my-ui/dot-pattern";
import "./style.css";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { FlipText } from "@/components/magicui/flip-text";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { Pointer } from "@/components/magicui/pointer";
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";
import {
  ArrowRight,
  ArrowRightIcon,
  ArrowRightSquare,
  ClipboardPenLine,
  CloudDownload,
  User2Icon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const avatars = [
  {
    imageUrl: "https://avatars.githubusercontent.com/u/106103625",
    profileUrl: "https://github.com/BankkRoll",
  },

  {
    imageUrl: "https://avatars.githubusercontent.com/u/89768406",
    profileUrl: "https://github.com/itsarghyadas",
  },
];

export function AvatarCirclesDemo() {
  return <AvatarCircles numPeople={2} avatarUrls={avatars} />;
}

export function FlipTextDemo() {
  return (
    <FlipText className="text-4xl font-bold -tracking-widest text-black dark:text-white md:text-7xl md:leading-[5rem]">
      Flip Text
    </FlipText>
  );
}

export default function Home() {
  const confettiRef = useRef<ConfettiRef>(null);

  function handleSubmit() {
    confettiRef.current?.fire({});
  }

  return (
    <>
      <div className="containerMax">
        <div className="nav">
          <div className="logo">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={100}
              height={100}
            ></Image>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <Dialog>
              <DialogTrigger asChild>
                <div>
                  <div className="auth">
                    <User2Icon size={19} />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Sign up</DialogTitle>
                  <DialogDescription>
                    Enter your credentials to access your account or register a
                    new one.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="Email"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      className="col-span-3"
                      placeholder="Password"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    variant="outline"
                    className="buttonAuth"
                  >
                    Signup
                  </Button>

                  <Button type="submit" className="buttonAuth">
                    Login
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="auth">
              <Settings size={19} />
            </div>
          </div>
        </div>
        <div className="containerFull">
          {" "}
          <div className="containerIn">
            <Confetti
              ref={confettiRef}
              className="absolute left-0 top-0 z-0 size-full"
            />
            <FlipText className="textTop">CoClip </FlipText>
            {/* <AvatarCirclesDemo /> */}
            <div style={{ scale: "0.9" }}>
              {" "}
              <div>
                <AnimatedGradientTextDemo />
              </div>
            </div>
            <div className="space"></div>{" "}
            <div className="space" style={{ height: "10px" }}></div>
            <div className="textarea">
              <div className="textSmall">
                Press Enter to sync text across your devices. Paste to retrieve
                clipboard content.
              </div>
              <Textarea
                placeholder="Paste your text and press Enter to sync."
                className="input"
              ></Textarea>
              <div className="buttonCont">
                <Button className="bg-white text-[#737373] border border-[#E5E5E5] button">
                  Retrieve <CloudDownload />
                </Button>
                <Button
                  className="bg-white text-[#737373] border border-[#E5E5E5] button"
                  onClick={() => handleSubmit()}
                >
                  Paste <ArrowRightSquare />
                </Button>
              </div>
            </div>
            <div className="space"></div>
            <div className="textSmall">Free upto 2 devices</div>
          </div>
          <div className="containerOut">
            <div className="retrieveCont">
              <Pointer className="fill-indigo-300" />

              <div className="top">
                <div className="textHeading">Your board</div>
                <div className="inputSearch">
                  {" "}
                  <Input placeholder="Search for item"></Input>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    </>
  );
}

export function AnimatedShinyTextDemo() {
  return (
    <div className="z-10 flex min-h-64 items-center justify-center">
      <div
        className={cn(
          "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>✨ Introducing Magic UI</span>
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
    </div>
  );
}

export function AnimatedGradientTextDemo() {
  return (
    <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
      <span
        className={cn(
          "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
        )}
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
          WebkitClipPath: "padding-box",
        }}
      />
      🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
      <AnimatedGradientText className="text-sm font-medium">
        Introducing CoClip AI
      </AnimatedGradientText>
      <ChevronRight
        className="ml-1 size-4 stroke-neutral-500 transition-transform
 duration-300 ease-in-out group-hover:translate-x-0.5"
      />
    </div>
  );
}
