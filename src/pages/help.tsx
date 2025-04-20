import { NextPage } from "next";
import { Shell } from "../components/layouts/Shell";

const HelpPage: NextPage = () => {
  return (
    <Shell>
      <div className="p-3">
        <article className="prose prose-base prose-h1:text-lg prose-h1:font-semibold prose-h2:text-base prose-h2:font-semibold ">
          <h1>Getting Started</h1>
        </article>
      </div>
    </Shell>
  );
};

export default HelpPage;
