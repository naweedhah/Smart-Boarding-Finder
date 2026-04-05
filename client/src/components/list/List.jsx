import "./list.scss";
import Card from "../card/Card";

function List({
  posts,
  onRemoveSaved,
  onReportSuccess,
  reportEnabled = false,
}) {
  return (
    <div className="list">
      {posts.map((item) => (
        <Card
          key={item.id}
          item={item}
          onRemoveSaved={onRemoveSaved}
          onReportSuccess={onReportSuccess}
          reportEnabled={reportEnabled}
        />
      ))}
    </div>
  );
}

export default List;
