import Router from "next/router";

interface SubmitHandlerParams {
  evt: React.FormEvent<HTMLFormElement>; // Adjust if your event type is different
  path: string;
  redirect?: string; // Making redirect optional
  additionalInfo?: Record<string, any>; // More precise typing for additionalInfo
  preCheck?: (data: Record<string, any>) => boolean | Promise<boolean>;
}

export default async function handleSubmit({evt, path, redirect, additionalInfo, preCheck}: SubmitHandlerParams): Promise<{ message: string } | true> {
  evt.preventDefault();

  const formData = new FormData(evt.currentTarget); // evt.target if you're sure it's the form element

  let jsonObject: Record<string, any> = {};

  // Merge additionalInfo into jsonObject
  if (additionalInfo) {
    Object.entries(additionalInfo).forEach(([key, value]) => {
      jsonObject[key] = value;
    });
  }

  // Merge formData into jsonObject
  formData.forEach((value, key) => {
    jsonObject[key] = value;
  });

  // Execute preCheck if provided
  if (preCheck) {
    const result = await preCheck(jsonObject); // Assuming preCheck can handle async operations
    if (result !== true) {
      return { message: "Pre-check failed" }; // Assuming you want to return an object with a message on failure
    }
  }

  // Submit the data
  const response = await fetch(`/api/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonObject),
  });

  const data = await response.json();

  if (!data) {
    return { message: "Submission failure" };
  }

  // Redirect if necessary and successful
  if (redirect) {
    Router.push(redirect); // Use the given redirect path instead of hardcoded "/"
  }

  return true;
}