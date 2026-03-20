import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Card from "./Card";

describe("Card", () => {
  it("renders its children", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("defaults to a div element", () => {
    render(<Card>Div</Card>);
    expect(screen.getByText("Div").tagName).toBe("DIV");
  });

  it("renders as a section when as=section", () => {
    render(<Card as="section">Section</Card>);
    expect(screen.getByText("Section").tagName).toBe("SECTION");
  });

  it("applies padding-md class by default", () => {
    render(<Card>Padded</Card>);
    expect(screen.getByText("Padded")).toHaveClass("p-6");
  });

  it("applies padding-lg class when padding=lg", () => {
    render(<Card padding="lg">Large</Card>);
    expect(screen.getByText("Large")).toHaveClass("p-8");
  });

  it("applies no padding class when padding=none", () => {
    render(<Card padding="none">NoPad</Card>);
    const el = screen.getByText("NoPad");
    expect(el).not.toHaveClass("p-6");
    expect(el).not.toHaveClass("p-8");
  });

  it("adds overflow-hidden class when overflow=true", () => {
    render(<Card overflow>Overflow</Card>);
    expect(screen.getByText("Overflow")).toHaveClass("overflow-hidden");
  });

  it("does not add overflow-hidden when overflow is omitted", () => {
    render(<Card>NoOverflow</Card>);
    expect(screen.getByText("NoOverflow")).not.toHaveClass("overflow-hidden");
  });

  it("adds cursor-pointer class when onClick is provided", () => {
    render(<Card onClick={() => {}}>Clickable</Card>);
    expect(screen.getByText("Clickable")).toHaveClass("cursor-pointer");
  });

  it("does not add cursor-pointer when onClick is absent", () => {
    render(<Card>Static</Card>);
    expect(screen.getByText("Static")).not.toHaveClass("cursor-pointer");
  });

  it("calls onClick when clicked", async () => {
    const handler = jest.fn();
    render(<Card onClick={handler}>Click</Card>);
    await userEvent.click(screen.getByText("Click"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("merges extra className", () => {
    render(<Card className="custom-class">Styled</Card>);
    expect(screen.getByText("Styled")).toHaveClass("custom-class");
  });

  it("merges inline style overrides", () => {
    render(<Card style={{ opacity: "0.5" }}>Styled</Card>);
    expect(screen.getByText("Styled").style.opacity).toBe("0.5");
  });
});
