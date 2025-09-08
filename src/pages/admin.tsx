import { useState } from "react";

export const Admin = () => {
  const [showform, setShowForm] = useState(false);

  return (
    <div>
      <div>admin</div>
      <div>
        <button onClick={() => setShowForm(true)}>
          create a new application form
        </button>
        <button>view all application forms</button>
      </div>
      {showform && (
        <div>
          <div>
            
          </div>
        </div>
      )}
    </div>
  );
};
