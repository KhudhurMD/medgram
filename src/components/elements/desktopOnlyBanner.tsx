export const DesktopOnlyBanner = () => {
  return (
    <>
      <div className="absolute bottom-4 left-0 w-full px-5 z-30">
        <div className="flex justify-between flex-col overflow-hidden">
          <div className="flex justify-between items-center rounded-xl w-full bg-primary-50 border border-dashed border-primary-600  shadow-md px-4 py-2">
            <div>
              <p className="font-medium">Full features on desktop</p>
              <p className="text-sm text-gray-600">Only text editing is supported on mobile. Please try it on desktop!</p>
              <div className="flex items-center space-x-4 mt-2 mb-1">
                <a className="bg-primary-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:opacity-80" href="/v1/edit">
                  Old Editor
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
