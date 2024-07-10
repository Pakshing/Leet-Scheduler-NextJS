import Image from "next/image";
import OauthLoginDialog from "../../components/dialog/OauthLoginDialog";

export default function Home() {


  return (
    <div className="flex justify-center items-center bg-gray-300 h-screen">
        <div className="content-section m-12 w-auto h-4/5 bg-theme-color text-center flex rounded-lg">
            <div className="intro-text w-2/5 ml-8 sm:mr-8 text-white items-center justify-center flex flex-col leading-10">
                <div className="max-w-xl">
                    <h1 className="font-extrabold text-4xl mb-10">LeetCode Scheduler</h1>
                    <p className="text-xl leading-relaxed pb-10">Introducing Leetcode Scheduler! This application facilitates the tracking of your Leetcode question completions and offers scheduling based on spaced-repetition learning techniques to optimize your learning process. Embark on your journey to Leetcode mastery today!</p>
                    <OauthLoginDialog/>
                </div>
            </div>
            <div className="hidden lg:flex w-3/5 items-center justify-center mr-10 rounded-lg">
                <Image src="/homeQuestions.png" alt="Questions" width={1200} height={1200} />
            </div>
        </div>
    </div>
  );
}