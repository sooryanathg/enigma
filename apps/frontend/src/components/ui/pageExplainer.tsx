export const PageExplainer = ({ pageTitle }: { pageTitle: string }) => {
  return (
    <div className="flex w-full h-fit p-4 lg:p-8 bg-black text-white">
      <h1 className="font-whirlyBirdie text-base lg:text-2xl font-bold">
        {pageTitle}
      </h1>
    </div>
  );
};
