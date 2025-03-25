"use client";
import Image from "next/image";
import { toast } from "sonner";
import "./style.css";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { FlipText } from "@/components/magicui/flip-text";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Pointer } from "@/components/magicui/pointer";
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { ArrowRightSquare, CloudDownload, User2Icon } from "lucide-react";
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
import { supabase } from "@/services/supabase";
import Link from "next/link";

const avatars = [
  {
    imageUrl:
      "https://divyanshudhruv.is-a.dev/_next/image?url=%2Fme.png&w=384&q=95",
    profileUrl: "https://github.com/divyanshudhruv",
  },
];

function AvatarCirclesDemo() {
  return <AvatarCircles numPeople={0} avatarUrls={avatars} />;
}

export default function Home() {
  const confettiRef = useRef<ConfettiRef>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [userID, setUserID] = useState("");
  const [isButtonLoading, setIsButtonloading] = useState(false);

  async function handleLogout() {
    const emptyDiv = document.getElementById("emptyDiv");
    if (emptyDiv) {
      emptyDiv.style.display = "flex";
    }
    setLoginLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
      toast.error("An error occurred while logging out. " + error.message);
      setLoginLoading(false);
    } else {
      console.log("Logout successful");
      toast.success("Logout successful.");
      setLoginLoading(false);
      setLoginSuccessful(true);
      supabase.auth.signOut();

      setTimeout(() => {
        setLoginSuccessful(false);
        window.location.reload();
      }, 1000);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setUserID(session.user.id);
      }
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setUserID(session.user.id);
      }
    });
    async function loadHistory() {
      if (userID) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("history")
          .eq("uid", userID)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
          toast.error("An error occurred while fetching user data.");
          return;
        }

        const historyData = userData?.history || {};
        const scrollableCont = document.getElementById("scrollableCont");
        const searchInput = document.getElementById(
          "searchForItem"
        ) as HTMLInputElement;

        if (scrollableCont) {
          scrollableCont.innerHTML = ``;

          if (Object.keys(historyData).length === 0) {
            const emptyDiv = document.createElement("div");
            emptyDiv.style.display = "flex";
            emptyDiv.style.alignItems = "center";
            emptyDiv.style.justifyContent = "center";
            emptyDiv.style.flexDirection = "column";
            emptyDiv.style.width = "100%";
            emptyDiv.style.height = "fit-content";

            const dateDiv = document.createElement("div");
            dateDiv.className = "date";
            dateDiv.textContent = "History";
            emptyDiv.appendChild(dateDiv);

            const dateTextDiv = document.createElement("div");
            dateTextDiv.className = "dateText";
            dateTextDiv.textContent = "There is nothing to show :P";
            emptyDiv.appendChild(dateTextDiv);

            scrollableCont.appendChild(emptyDiv);
          } else {
            for (const date in historyData) {
              if (historyData.hasOwnProperty(date)) {
                const clips = historyData[date];

                const dateDiv = document.createElement("div");
                dateDiv.className = "date";
                dateDiv.textContent = date;
                scrollableCont.appendChild(dateDiv);

                clips.forEach(
                  (clip: { text: string; time: string; id: string }) => {
                    const copiedDiv = document.createElement("div");
                    copiedDiv.className = "copied";
                    copiedDiv.style.marginBottom = "5px";

                    const timeDiv = document.createElement("div");
                    timeDiv.className = "time";

                    timeDiv.textContent = clip.time;
                    copiedDiv.appendChild(timeDiv);

                    const iconsDiv = document.createElement("div");
                    iconsDiv.className = "icons";

                    const copyDiv = document.createElement("div");
                    copyDiv.className = "item";
                    copyDiv.id = `copy`;
                    copyDiv.setAttribute("data-clip-id", clip.id);
                    copyDiv.onclick = async () => {
                      const copiedTextValue = await copyClipFromHistory(
                        clip.id,
                        userID
                      );
                      if (copiedTextValue) {
                        try {
                          await navigator.clipboard.writeText(copiedTextValue);
                          console.log("Text copied to clipboard");
                          toast.success(
                            "Text copied to clipboard from " + clip.id
                          );
                        } catch (err) {
                          console.error("Failed to copy text: ", err);
                        }
                      }
                    };
                    const copyIcon = document.createElement("div");
                    copyIcon.innerHTML =
                      '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20"><path fill="currentColor" d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 0 1 2 2v4h4V2H8v4zM2 8v10h10V8H2z"/></svg>';
                    copyDiv.appendChild(copyIcon);
                    iconsDiv.appendChild(copyDiv);

                    const deleteDiv = document.createElement("div");
                    deleteDiv.className = "item";
                    deleteDiv.id = "delete";
                    deleteDiv.setAttribute("data-clip-id", clip.id);
                    deleteDiv.onclick = () =>
                      deleteClipFromHistory(clip.id, userID);
                    const deleteIcon = document.createElement("div");
                    deleteIcon.innerHTML =
                      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m13.5 10l4 4m0-4l-4 4m6.095 4.5H9.298a2 2 0 0 1-1.396-.568l-5.35-5.216a1 1 0 0 1 0-1.432l5.35-5.216A2 2 0 0 1 9.298 5.5h10.297c.95 0 2.223.541 2.223 1.625v9.75c0 1.084-1.273 1.625-2.223 1.625Z"/></svg>';
                    deleteDiv.appendChild(deleteIcon);
                    iconsDiv.appendChild(deleteDiv);

                    copiedDiv.appendChild(iconsDiv);

                    const textDiv = document.createElement("div");
                    textDiv.className = "text";
                    textDiv.textContent =
                      clip.text.length > 100
                        ? clip.text.substring(0, 100) + "..."
                        : clip.text;
                    copiedDiv.appendChild(textDiv);

                    scrollableCont.appendChild(copiedDiv);
                  }
                );
              }
            }
          }
        }

        if (searchInput) {
          searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.toLowerCase();
            const copiedDivs = scrollableCont?.getElementsByClassName("copied");

            if (copiedDivs) {
              for (let i = 0; i < copiedDivs.length; i++) {
                const copiedDiv = copiedDivs[i] as HTMLElement;
                const textDiv = copiedDiv.querySelector(".text");
                const textContent = textDiv?.textContent?.toLowerCase() || "";

                if (textContent.includes(searchTerm)) {
                  copiedDiv.style.display = "block";
                } else {
                  copiedDiv.style.display = "none";
                }
              }
            }
          });
        }
      }
    }

    loadHistory();

    if (userID) {
      const historySubscription = supabase
        .channel("any")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "users",
            filter: `uid=eq.${userID}`,
          },
          (_event: {
            new: {
              history?: {
                [key: string]: Array<{
                  text: string;
                  time: string;
                  id: string;
                }>;
              };
            };
          }) => {
            console.log(_event); // Temporary usage to avoid unused variable error
            loadHistory();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(historySubscription);
      };
    }
  }, [userID]);

  async function handleSignup() {
    setSignUpLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          email,
          password,
          created_at: new Date(),
          history: {},
        },
      },
    });
    insertDataToSupabse();
    if (error) {
      console.error("Error signing up:", error.message);
      toast.error("An error occurred while signing up. " + error.message);
      setSignUpLoading(false);
    } else {
      console.log("Signup successful:", data);
      setSignUpLoading(false);
      setSignupSuccessful(true);
      toast.success("Signup successful.");
      setTimeout(() => {
        setSignupSuccessful(false);
      }, 2000);
    }
  }

  async function insertDataToSupabse() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const { error: insertError } = await supabase.from("users").insert([
      {
        uid: session?.user.id,
        email,
        password,
        created_at: new Date(),
        history: {},
      },
    ]);

    if (insertError) {
      console.error("Error inserting data:", insertError.message);
      toast.error(
        "An error occurred while inserting data. " + insertError.message
      );
    } else {
      console.log("Data inserted successfully");
    }
  }
  async function handleLogin() {
    setLoginLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error logging in:", error.message);
      toast.error("An error occurred while logging in. " + error.message);
      setLoginLoading(false);
    } else {
      console.log("Login successful:", data);
      toast.success("Login successful.");
      setLoginLoading(false);
      setLoginSuccessful(true);
      const emptyDiv = document.getElementById("emptyDiv");
      if (emptyDiv) {
        emptyDiv.style.display = "none";
      }

      setTimeout(() => {
        setLoginSuccessful(false);
      }, 2000);
    }
  }

  async function deleteClipFromHistory(clipId: string, userId: string) {
    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("history")
        .eq("uid", userId)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError);
        return false;
      }

      if (!user || !user.history) {
        console.warn("User or history not found.");
        return false;
      }

      const history = user.history;

      const updatedHistory: {
        [key: string]: Array<{ text: string; time: string; id: string }>;
      } = {};

      for (const date in history) {
        if (history.hasOwnProperty(date)) {
          const clips = history[date];
          const updatedClips = clips.filter(
            (clip: { id: string }) => clip.id !== clipId
          );
          if (updatedClips.length > 0) {
            updatedHistory[date] = updatedClips;
          }
        }
      }

      const { error: updateError } = await supabase
        .from("users")
        .update({ history: updatedHistory })
        .eq("uid", userId);

      if (updateError) {
        console.error("Error updating user:", updateError);
        return false;
      }

      console.log("Clip deleted from history.");
      toast.success("Clip deleted from history.");
      return true;
    } catch (error) {
      console.error("An error occurred:", error);
      return false;
    }
  }

  async function copyClipFromHistory(clipId: string, userId: string) {
    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("history")
        .eq("uid", userId)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError);
        return null;
      }

      if (!user || !user.history) {
        console.warn("User or history not found.");
        return null;
      }

      const history = user.history;

      for (const date in history) {
        if (history.hasOwnProperty(date)) {
          const clips = history[date];
          const clipToCopy = clips.find(
            (clip: { id: string }) => clip.id === clipId
          );

          if (clipToCopy) {
            console.log("Clip found:", clipToCopy.text);
            return clipToCopy.text;
          }
        }
      }

      console.log("Clip not found in history.");
      return null;
    } catch (error) {
      console.error("An error occurred:", error);
      return null;
    }
  }
  async function handleSubmit() {
    if (!copiedText) return;
    confettiRef.current?.fire({});
    setIsButtonloading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user.id;
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();
    const formattedDate = `${day}${
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th"
    } ${month} ${year}`;

    if (userId) {
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("history")
          .eq("uid", userId)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError.message);
          return;
        }

        const existingHistory = userData?.history || {};

        const updatedHistory = { ...existingHistory };
        const clipObject = {
          text: copiedText,
          time: new Date().toLocaleTimeString(),
          id: Math.floor(100000 + Math.random() * 900000).toString(),
        };

        if (updatedHistory[formattedDate]) {
          updatedHistory[formattedDate].unshift(clipObject);
        } else {
          updatedHistory[formattedDate] = [clipObject];
        }

        const { error: updateError } = await supabase
          .from("users")
          .update({ history: updatedHistory })
          .eq("uid", userId);

        if (updateError) {
          console.error("Error updating history:", updateError.message);
        } else {
          console.log("History updated successfully");
          toast.success("New clip added successfully.");
          setCopiedText("");
          setIsButtonloading(false);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      }
    }
  }

  return (
    <>
      <div className="containerMax">
        <div className="nav">
          <div className="logo ">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={100}
              height={100}
            ></Image>
          </div>
          <Link href={"https://github.com/divyanshudhruv/coclip"}>
            <ShinyButton style={{ cursor: "pointer", height: "40px" }}>
              GITHUB
            </ShinyButton>
          </Link>
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
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="Email"
                      className="col-span-3"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      className="col-span-3"
                      placeholder="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="buttonAuth"
                    onClick={handleSignup}
                    disabled={signUpLoading}
                  >
                    {signupSuccessful
                      ? "Done!"
                      : signUpLoading
                      ? "Signing up..."
                      : "Signup"}
                  </Button>

                  <Button
                    type="button"
                    className="buttonAuth"
                    onClick={handleLogin}
                    disabled={loginLoading}
                  >
                    {loginSuccessful
                      ? "Done!"
                      : loginLoading
                      ? "Logging in..."
                      : "Login"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <div>
                  <div className="auth">
                    <Settings size={19} />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Log out</DialogTitle>
                  <DialogDescription>
                    To logout from your account, click the button below.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <Button
                    type="button"
                    className="buttonAuth"
                    onClick={handleLogout}
                  >
                    {loginSuccessful
                      ? "Done!"
                      : loginLoading
                      ? "Logging you out..."
                      : "Logout"}{" "}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="containerFull">
          {" "}
          <div className="containerIn">
            <Confetti
              ref={confettiRef}
              className="absolute left-0 top-0 z-0 size-full"
            />
            <FlipText className="textTop" key="static-flip-text">
              CoClip
            </FlipText>
            {/* <AvatarCirclesDemo /> */}
            <div style={{ scale: "0.9" }}>
              {" "}
              <div style={{ cursor: "pointer" }}>
                <AnimatedGradientTextDemo />
              </div>
            </div>
            <div className="space"></div>{" "}
            <div className="space" style={{ height: "10px" }}></div>
            <div className="textarea">
              <div className="textSmall fade-up">
                Press Enter to sync text across your devices. Paste to retrieve
                clipboard content.
              </div>
              <Textarea
                placeholder="Paste your text here. (Shift + Enter for new line)"
                className="input fade-up-2"
                value={copiedText}
                onChange={(e) => {
                  setCopiedText(e.target.value);
                  // Scroll to the bottom of the textarea
                  e.target.scrollTop = e.target.scrollHeight;
                }}
                disabled={isButtonLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                spellCheck={false}
              ></Textarea>
              <div className="buttonCont">
                <Button
                  className="bg-white text-[#737373] border border-[#E5E5E5] button fade-up-5"
                  onClick={() => window.location.reload()}
                >
                  Retrieve <CloudDownload />
                </Button>
                <Button
                  className="bg-white text-[#737373] border border-[#E5E5E5] button fade-up-6"
                  onClick={() => handleSubmit()}
                >
                  Paste <ArrowRightSquare />
                </Button>
              </div>
            </div>
            <div className="textSmall fade-up-3" style={{ marginTop: "25px" }}>
              Made by
              <div style={{ scale: "0.8" }}>
                <AvatarCirclesDemo />
              </div>
            </div>
          </div>
          <div className="containerOut">
            <div className="retrieveCont ">
              <div className="top">
                {" "}
                <div className="textHeading">Your board</div>{" "}
                <div className="inputSearch">
                  {" "}
                  <Input
                    placeholder="Search for item"
                    id="searchForItem"
                  ></Input>
                </div>
              </div>
              <div className="bottom">
                <Pointer className="fill-indigo-300" />

                <div className="scrollableCont" id="scrollableCont">
                  {" "}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      width: "100%",
                      height: "fit-content",
                    }}
                    id="emptyDiv"
                  >
                    <div className="date">History</div>
                    <div className="dateText">
                      Sign in to start using CoClip effortlessly{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
      </div>
    </>
  );
}

function AnimatedGradientTextDemo() {
  return (
    <div className="fade-up-4 group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] ">
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
      <AnimatedGradientText className="text-sm font-medium  ">
        Introducing CoClip
      </AnimatedGradientText>
      <ChevronRight
        className="ml-1 size-4 stroke-neutral-500 transition-transform
 duration-300 ease-in-out group-hover:translate-x-0.5"
      />
    </div>
  );
}
