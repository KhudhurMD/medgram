import { NextPage } from "next";
import { Shell } from "../components/layouts/Shell";

const GuidePage: NextPage = () => {
  return (
    <Shell>
      <div className="p-3">
        <article className="prose prose-base prose-h1:text-lg prose-h1:font-semibold prose-h2:text-base prose-h2:font-semibold ">
          <h1>Getting Started</h1>
          <p>
            I created a short 4-minute video to help you get started with MedGram. I'll be adding written instructions, interactive examples and more
            videos soon!
          </p>
          <div>
            <iframe
              title="Getting Started"
              src="https://www.loom.com/embed/f184a7510d244f19935a4b354dd56cc3"
              style={{ width: "100%", height: "410px" }}
            ></iframe>
          </div>
        </article>
      </div>
    </Shell>
  );
};

export default GuidePage;
