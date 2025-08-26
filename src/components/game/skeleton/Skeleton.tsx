import type { GridSize } from "@/pages/game/types.ts";
import "./Skeleton.css";

type SkeletonProps = {
  gridSize: GridSize;
};

const Skeleton = ({ gridSize }: SkeletonProps) => {
  return (
    <div
      className="skeleton__grid skeleton__grid--loading"
      role="grid"
      aria-busy="true"
      aria-label="Loading board"
      style={{
        gridTemplateRows: `repeat(${gridSize.rows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))`,
      }}
    >
      {/* skeleton cells */}
      {Array.from({ length: gridSize.rows * gridSize.cols }).map((_, i) => (
        <div key={i} className="skeleton-card" aria-hidden />
      ))}
    </div>
  );
};

export default Skeleton;
