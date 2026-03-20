import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CashFlowChart from "./CashFlowChart";
import { monthlyFlow } from "@/lib/data";

describe("CashFlowChart", () => {
  it("renders period toggle buttons: 3M, 6M, 1A", () => {
    render(<CashFlowChart />);
    expect(screen.getByRole("button", { name: "3M" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "6M" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1A" })).toBeInTheDocument();
  });

  it("defaults to 6M period — shows all month labels", () => {
    render(<CashFlowChart />);
    // All 6 months should be visible
    for (const entry of monthlyFlow) {
      expect(
        screen.getByText(entry.month.toUpperCase().slice(0, 3))
      ).toBeInTheDocument();
    }
  });

  it("switches to 3M and shows only last 3 month labels", async () => {
    render(<CashFlowChart />);
    await userEvent.click(screen.getByRole("button", { name: "3M" }));

    const visible = monthlyFlow.slice(-3);
    const hidden = monthlyFlow.slice(0, 3);

    for (const entry of visible) {
      expect(
        screen.getByText(entry.month.toUpperCase().slice(0, 3))
      ).toBeInTheDocument();
    }
    for (const entry of hidden) {
      expect(
        screen.queryByText(entry.month.toUpperCase().slice(0, 3))
      ).not.toBeInTheDocument();
    }
  });

  it("6M button is active by default", () => {
    render(<CashFlowChart />);
    const btn6M = screen.getByRole("button", { name: "6M" });
    expect(btn6M.style.backgroundColor).toBe("var(--primary-container)");
  });

  it("3M button becomes active after click", async () => {
    render(<CashFlowChart />);
    await userEvent.click(screen.getByRole("button", { name: "3M" }));
    expect(screen.getByRole("button", { name: "3M" }).style.backgroundColor).toBe(
      "var(--primary-container)"
    );
    expect(screen.getByRole("button", { name: "6M" }).style.backgroundColor).toBe(
      "transparent"
    );
  });
});
