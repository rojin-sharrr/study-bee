const cronFunction = ( runEveryXSeconds: number, callback: () => Promise<void>): void => {
  (async () => {
    while (true) {
      try {
        await callback();
        await new Promise((resolve) =>
          setTimeout(resolve, runEveryXSeconds * 1000)
        );
      } catch (error) {
        console.error("Error in cron job:", error);
        await new Promise((resolve) =>
          setTimeout(resolve, runEveryXSeconds * 1000)
        );
      }
    }
  })();
};

export default cronFunction;


