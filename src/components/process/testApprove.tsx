import React from "react";
import { useProcessActions } from "./hooks/useProcessActions";
import type { ProcessStep } from "../../types/process";

const TestHandleApprove: React.FC = () => {
  const { handleApprove } = useProcessActions();

  const mockStep: ProcessStep = {
    id: "step1",
    documentId: "doc1",
    userId: "user1",
    UserDestinatorName: "John Doe",
    nextEtapeName: "Next Step",
    name: "Step Name",
    order: 1,
    assignedTo: "user1",
    status: "in_progress",
  };

  const mockComment = "This is a test comment.";
  const mockAttachments = [
    new File(["file content"], "testfile1.txt", { type: "text/plain" }),
    new File(["file content"], "testfile2.txt", { type: "text/plain" }),
  ];

  const handleTestApprove = () => {
    handleApprove(mockStep, mockComment, mockAttachments);
  };

  return (
    <div>
      <button onClick={handleTestApprove}>Test Approve</button>
    </div>
  );
};

export default TestHandleApprove;
