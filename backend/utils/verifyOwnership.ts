const verifyOwnership =  (trueId: string, checkId: string): boolean => {
  if (trueId !== checkId) {
    return false;
  }
  return true;
};

export default verifyOwnership;
