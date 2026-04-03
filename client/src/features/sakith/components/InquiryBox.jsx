import { useState } from "react";
import { createInquiry, acceptInquiry } from "../services/sakithService";

export default function InquiryBox() {
  const [id, setId] = useState("");

  const create = async () => {
    const res = await createInquiry({
      postId: "post1",
      ownerId: "owner1",
      type: "view"
    });
    setId(res.data.id);
    alert("Inquiry Created");
  };

  const accept = async () => {
    const res = await acceptInquiry(id);
    alert("Chat Created: " + res.data.chat.id);
  };

  return (
    <div className="card">
      <h3>Inquiry</h3>
      <button className="btn-primary" onClick={create}>Create</button>
      <button className="btn-teal" onClick={accept}>Accept</button>
    </div>
  );
}