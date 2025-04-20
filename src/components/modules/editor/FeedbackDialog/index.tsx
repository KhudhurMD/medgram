import { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { useMediaQuery } from 'usehooks-ts';
import { ContactDialog } from '../../../elements/ContactDialog';

export function FeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const isNotMobile = useMediaQuery('(min-width: 768px)');

  return (
    <>
      <div>
        {isNotMobile && (
          <button
            className="flex space-x-2 bg-gray-100 text-sm hover:bg-gray-200 px-2 h-fit py-1 rounded-md items-center justify-center cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <FaQuestionCircle className="h-4 w-4 text-gray-400 posthog-feedback-button" />
            <button className="text-gray-500">Feedback</button>
          </button>
        )}
      </div>

      <ContactDialog isOpen={isOpen} setIsOpen={setIsOpen} type="Feedback" />
    </>
  );
}
