import { render, screen } from "@testing-library/react";
import EyebrowLabel from "./EyebrowLabel";

describe("EyebrowLabel", () => {
  it("renders its children", () => {
    render(<EyebrowLabel>Montant</EyebrowLabel>);
    expect(screen.getByText("Montant")).toBeInTheDocument();
  });

  it("defaults to surface-variant color (dark background text)", () => {
    render(<EyebrowLabel>Label</EyebrowLabel>);
    expect(screen.getByText("Label").style.color).toBe("var(--on-surface-variant)");
  });

  it("uses light color when light prop is true", () => {
    render(<EyebrowLabel light>Label</EyebrowLabel>);
    expect(screen.getByText("Label").style.color).toBe("rgba(217, 255, 254, 0.7)");
  });

  it("merges extra className", () => {
    render(<EyebrowLabel className="mb-2">Label</EyebrowLabel>);
    expect(screen.getByText("Label")).toHaveClass("mb-2");
  });
});
