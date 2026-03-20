import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge", () => {
  it("renders its text content", () => {
    render(<Badge>Revenus</Badge>);
    expect(screen.getByText("Revenus")).toBeInTheDocument();
  });

  it("defaults to neutral variant", () => {
    render(<Badge>Label</Badge>);
    const badge = screen.getByText("Label");
    expect(badge.style.color).toBe("var(--on-surface-variant)");
    expect(badge.style.backgroundColor).toBe("var(--surface-container-high)");
  });

  it("applies primary variant colors", () => {
    render(<Badge variant="primary">Primary</Badge>);
    const badge = screen.getByText("Primary");
    expect(badge.style.color).toBe("var(--primary)");
    expect(badge.style.backgroundColor).toBe("var(--primary-container)");
  });

  it("applies error variant colors", () => {
    render(<Badge variant="error">Error</Badge>);
    const badge = screen.getByText("Error");
    expect(badge.style.color).toBe("var(--error)");
  });

  it("allows custom color and bg overrides", () => {
    render(
      <Badge variant="custom" color="#ff0000" bg="#000000">
        Custom
      </Badge>
    );
    const badge = screen.getByText("Custom");
    expect(badge.style.color).toBe("rgb(255, 0, 0)");
    expect(badge.style.backgroundColor).toBe("rgb(0, 0, 0)");
  });

  it("custom color prop overrides variant color", () => {
    render(<Badge variant="primary" color="#abcdef">Override</Badge>);
    const badge = screen.getByText("Override");
    // custom color takes precedence
    expect(badge.style.color).toBe("rgb(171, 205, 239)");
  });

  it("merges extra className", () => {
    render(<Badge className="extra-class">Styled</Badge>);
    expect(screen.getByText("Styled")).toHaveClass("extra-class");
  });
});
