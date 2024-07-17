import Image from "next/image";
import OauthLoginDialog from "../../components/dialog/OauthLoginDialog";

export default function Home() {


  return (
    <div className="flex justify-center items-center bg-gray-300 h-screen">
        <div className="content-section m-4 sm:m-12 w-auto h-auto sm:h-4/5 bg-theme-color text-center  justify-center flex flex-col lg:flex-row rounded-lg">
            <div className="intro-text w-full lg:w-2/5 p-8 lg:ml-8 text-white items-center justify-center flex flex-col leading-10">
                <div className="max-w-xl">
                    <h1 className="font-extrabold text-4xl mb-10">LeetCode Scheduler</h1>
                    <p className="text-xl leading-relaxed pb-10">Introducing Leetcode Scheduler! This application facilitates the tracking of your Leetcode question completions and offers scheduling based on spaced-repetition learning techniques to optimize your learning process. Embark on your journey to Leetcode mastery today!</p>
                    <OauthLoginDialog/>
                </div>
            </div>
            <div className="hidden lg:flex lg:w-3/5 items-center justify-center lg:mr-10 rounded-lg">
                <Image src="/homeQuestions.png" alt="Questions" width={1200} height={1200} />
            </div>
        </div>
    </div>
  );
}