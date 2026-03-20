import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const handler = jest.fn();
    render(<Button onClick={handler}>Submit</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const handler = jest.fn();
    render(<Button disabled onClick={handler}>Disabled</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(handler).not.toHaveBeenCalled();
  });

  it("applies a circular border-radius for icon variant", () => {
    render(<Button variant="icon">X</Button>);
    const btn = screen.getByRole("button");
    expect(btn.style.borderRadius).toBe("50%");
  });

  it("applies rounded border-radius for non-icon variants", () => {
    render(<Button variant="primary">Primary</Button>);
    const btn = screen.getByRole("button");
    expect(btn.style.borderRadius).toBe("0.75rem");
  });

  it("renders as type=button by default (no form submission)", () => {
    render(<Button>No submit</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("type", "submit");
  });

  it("respects an explicit type=submit", () => {
    render(<Button type="submit">Save</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("merges extra className onto the element", () => {
    render(<Button className="my-custom">Label</Button>);
    expect(screen.getByRole("button")).toHaveClass("my-custom");
  });

  it("merges inline style overrides", () => {
    render(<Button style={{ width: "100%" }}>Full</Button>);
    expect(screen.getByRole("button").style.width).toBe("100%");
  });

  it("link variant has no padding (padding: 0 in variantStyles)", () => {
    render(<Button variant="link">Link</Button>);
    // link variant sets padding: 0 in variantStyles and skips sizeStyles
    expect(screen.getByRole("button").style.padding).toBe("0px");
  });

  it("ghost variant has transparent background", () => {
    render(<Button variant="ghost">Ghost</Button>);
    // transparent resolved by JSDOM
    const bg = screen.getByRole("button").style.backgroundColor;
    expect(bg).toBe("transparent");
  });
});
