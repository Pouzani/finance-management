import { render } from "@testing-library/react";
import ProgressBar from "./ProgressBar";

// Structure: container > div.track > div.fill
function getFill(container: HTMLElement) {
  return container.firstElementChild!.firstElementChild as HTMLElement;
}

describe("ProgressBar", () => {
  it("renders a fill bar with the given percentage width", () => {
    const { container } = render(<ProgressBar value={60} />);
    expect(getFill(container).style.width).toBe("60%");
  });

  it("clamps values above 100 to 100%", () => {
    const { container } = render(<ProgressBar value={150} />);
    expect(getFill(container).style.width).toBe("100%");
  });

  it("clamps negative values to 0%", () => {
    const { container } = render(<ProgressBar value={-20} />);
    expect(getFill(container).style.width).toBe("0%");
  });

  it("renders 0% for value=0", () => {
    const { container } = render(<ProgressBar value={0} />);
    expect(getFill(container).style.width).toBe("0%");
  });

  it("renders 100% for value=100", () => {
    const { container } = render(<ProgressBar value={100} />);
    expect(getFill(container).style.width).toBe("100%");
  });

  it("applies a custom color to the fill bar", () => {
    const { container } = render(<ProgressBar value={50} color="#ff0000" />);
    // JSDOM normalises #ff0000 → rgb(255, 0, 0)
    expect(getFill(container).style.backgroundColor).toBe("rgb(255, 0, 0)");
  });

  it("defaults color to the primary CSS variable", () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(getFill(container).style.backgroundColor).toBe("var(--primary)");
  });

  it("track bar always spans full width", () => {
    const { container } = render(<ProgressBar value={40} />);
    const track = container.firstElementChild as HTMLElement;
    expect(track).toHaveClass("w-full");
  });
});
