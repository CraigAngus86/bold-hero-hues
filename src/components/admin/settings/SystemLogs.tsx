
// Find the Button with variant="warning" and change it to variant="destructive" or another valid variant
// Just replace the specific Button component that has the warning variant:

<Button 
  variant="destructive" // Changed from "warning" to "destructive"
  size="sm"
  onClick={clearLogsByType('error')}
>
  Clear Errors
</Button>
