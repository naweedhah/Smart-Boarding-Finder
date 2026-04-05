import { useState } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { createReport } from "../../features/sakith/services/sakithService";
import UploadWidget from "../uploadWidget/UploadWidget";
import "./card.scss";

const demandBadgeLabel = {
  high: "High demand",
  medium: "Medium demand",
  low: "Low demand",
};

function Card({ item, onRemoveSaved, onReportSuccess, reportEnabled = false }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportProof, setReportProof] = useState("");
  const [reportProofImage, setReportProofImage] = useState([]);
  const [reportError, setReportError] = useState("");
  const proofImageUrl = reportProofImage[0] || "";

  const handleRemoveSaved = async () => {
    if (!onRemoveSaved) return;

    try {
      setIsRemoving(true);
      await apiRequest.post("/users/save", { postId: item.id });
      onRemoveSaved(item.id);
    } catch (error) {
      onReportSuccess?.({
        type: "error",
        message: error.response?.data?.message || "Failed to remove saved boarding.",
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();

    if (!reportReason.trim()) {
      setReportError("Please provide a reason for the report.");
      return;
    }

    try {
      setIsSubmittingReport(true);
      setReportError("");
      await createReport({
        targetId: item.id,
        targetType: "boarding",
        reason: reportReason.trim(),
        postId: item.id,
        proofImage: proofImageUrl || undefined,
        description: reportProof.trim()
          ? `Proof / evidence:\n${reportProof.trim()}`
          : undefined,
      });
      setIsReportOpen(false);
      setReportReason("");
      setReportProof("");
      setReportProofImage([]);
      onReportSuccess?.({
        type: "success",
        message: "Boarding report submitted successfully.",
      });
    } catch (error) {
      setReportError(
        error.response?.data?.message || "Failed to submit boarding report.",
      );
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <div className={`demandBadge ${item.demandLevel || "low"}`}>
          <strong>{demandBadgeLabel[item.demandLevel] || "Low demand"}</strong>
          <span>
            {item.savedCount || 0} saves • {item.inquiryCount || 0} inquiries • {item.bookingCount || 0} bookings
          </span>
        </div>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}{item.area ? `, ${item.area}` : ""}</span>
        </p>
        <p className="price">LKR {item.rent}/month</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.remainingSlots ?? item.capacity} slots</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroomCount || 0} bathrooms</span>
            </div>
          </div>
          <div className="icons">
            {onRemoveSaved && (
              <button
                type="button"
                className="icon actionButton removeSavedButton"
                onClick={handleRemoveSaved}
                disabled={isRemoving}
                title="Remove from saved boardings"
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
            )}
            {reportEnabled && (
              <button
                type="button"
                className="icon actionButton reportButton"
                onClick={() => {
                  setReportError("");
                  setIsReportOpen(true);
                }}
                title="Report this boarding"
              >
                Report
              </button>
            )}
            <div className="icon">
              <img src="/chat.png" alt="" />
            </div>
          </div>
        </div>
      </div>

      {isReportOpen && (
        <div className="reportOverlay" onClick={() => setIsReportOpen(false)}>
          <div
            className="reportModal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="reportModalHeader">
              <div>
                <h3>Report Boarding</h3>
                <p>{item.title}</p>
              </div>
              <button
                type="button"
                className="closeModalButton"
                onClick={() => setIsReportOpen(false)}
              >
                Close
              </button>
            </div>

            <form className="reportForm" onSubmit={handleReportSubmit}>
              <label>
                <span>Reason</span>
                <textarea
                  value={reportReason}
                  onChange={(event) => setReportReason(event.target.value)}
                  placeholder="Explain why this boarding should be reviewed."
                  rows={4}
                  required
                />
              </label>

              <label>
                <span>Proof or evidence</span>
                <textarea
                  value={reportProof}
                  onChange={(event) => setReportProof(event.target.value)}
                  placeholder="Add supporting details, message excerpts, or a screenshot link."
                  rows={4}
                />
              </label>

              <div className="proofUploadBlock">
                <div className="proofUploadHeader">
                  <span>Upload proof image</span>
                  <UploadWidget
                    buttonId={`report_upload_${item.id}`}
                    buttonLabel="Upload Proof"
                    uwConfig={{
                      cloudName: "lamadev",
                      uploadPreset: "estate",
                      multiple: false,
                      maxImageFileSize: 3000000,
                      folder: "report-proofs",
                    }}
                    setState={setReportProofImage}
                  />
                </div>
                {proofImageUrl ? (
                  <div className="proofPreview">
                    <img src={proofImageUrl} alt="Uploaded report proof" />
                    <button
                      type="button"
                      className="secondaryAction"
                      onClick={() => setReportProofImage([])}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <p className="proofHint">
                    Upload a screenshot or photo as supporting proof.
                  </p>
                )}
              </div>

              {reportError && <p className="reportError">{reportError}</p>}

              <div className="reportActions">
                <button
                  type="button"
                  className="secondaryAction"
                  onClick={() => setIsReportOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSubmittingReport}>
                  {isSubmittingReport ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
