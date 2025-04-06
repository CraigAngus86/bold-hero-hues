
// Convert error to string in the catch block:
catch (error) {
  setError(error instanceof Error ? error.message : String(error));
}
