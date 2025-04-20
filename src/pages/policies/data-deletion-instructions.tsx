import { CaretLeft } from '@phosphor-icons/react';
import { Shell } from '../../components/layouts/Shell';

export const DataDeletionInstructions = () => {
  return (
    <Shell>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex space-x-1 items-center mb-4 group text-sm">
          <CaretLeft size={14} weight="bold" className="text-gray-400 group-hover:text-primary-500" />
          <a href="/policies" className="text-gray-500 group-hover:text-primary-500">
            Back to Policies
          </a>
        </div>

        <h1 className="mb-2 text-2xl">Data Deletion Instructions</h1>

        <p>
          MedGram does not store your personal data; it is used only for login. According to the Facebook Platform rules, we have to provide User Data
          Deletion Callback URL or Data Deletion Instructions URL. If you want to delete your activities for Medgram, please follow these
          instructions:
        </p>

        <ol className="my-2 list-decimal list-inside space-y-1 text-gray-800">
          <li>Go to Your Facebook Account’s Setting & Privacy. Click "Setting".</li>

          <li>Then, go to "Apps and Websites" and you will see all of your Apps activities.</li>

          <li>Select the option box for MedGrm.io</li>

          <li>Click "Remove" button.</li>

          <li>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</li>
        </ol>
      </div>
    </Shell>
  );
};

export default DataDeletionInstructions;
