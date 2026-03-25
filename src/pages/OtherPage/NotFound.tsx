import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import GridShape from "../../components/common/GridShape";
import Lottie from "lottie-react";
import animationData from "../../lottie/404.json";
import Button from "../../components/ui/button/Button";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="404 Not Found | Coach Max"
        description="We can't seem to find the page you are looking for!"
      />
      <div className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden bg-brand-25 dark:bg-gray-950 z-1">
        <GridShape />

        <div className="mx-auto w-full max-w-[500px] text-center">
          <div className="relative mb-8 transition-transform duration-500 hover:scale-105">
            <Lottie
              animationData={animationData}
              loop={true}
              className="mx-auto w-full max-w-[320px] sm:max-w-[400px]"
            />
          </div>

          <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl xl:text-5xl tracking-tight">
            Oops! <span className="text-brand-500 dark:text-brand-400">Page Not Found</span>
          </h1>

          <p className="mt-4 mb-10 text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
            The page you're looking for was moved, removed, renamed, or might never have existed. Let's get you back on track.
          </p>

          <Link to="/">
            <Button
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
              }
              className="px-8 py-4 text-base rounded-xl bg-brand-500 hover:bg-brand-600 shadow-lg hover:shadow-brand-200"
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* <!-- Footer --> */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-400 dark:text-gray-500">
          &copy; {new Date().getFullYear()} Coach Max Admin
        </p>
      </div>
    </>
  );
}
