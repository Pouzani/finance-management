import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuickTransaction from "./QuickTransaction";

describe("QuickTransaction", () => {
  it("renders the form with amount input", () => {
    render(<QuickTransaction />);
    expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
  });

  it("renders Dépense and Revenu toggle buttons", () => {
    render(<QuickTransaction />);
    expect(screen.getByRole("button", { name: "Dépense" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Revenu" })).toBeInTheDocument();
  });

  it("defaults to expense type — Dépense button is active (primary bg)", () => {
    render(<QuickTransaction />);
    const depenseBtn = screen.getByRole("button", { name: "Dépense" });
    expect(depenseBtn.style.backgroundColor).toBe("var(--primary)");
  });

  it("Revenu button is inactive by default (not primary bg)", () => {
    render(<QuickTransaction />);
    const revenuBtn = screen.getByRole("button", { name: "Revenu" });
    expect(revenuBtn.style.backgroundColor).not.toBe("var(--primary)");
  });

  it("switches to income when Revenu button is clicked", async () => {
    render(<QuickTransaction />);
    const revenuBtn = screen.getByRole("button", { name: "Revenu" });
    await userEvent.click(revenuBtn);
    expect(revenuBtn.style.backgroundColor).toBe("var(--primary)");
  });

  it("switches back to expense when Dépense is clicked after income", async () => {
    render(<QuickTransaction />);
    await userEvent.click(screen.getByRole("button", { name: "Revenu" }));
    await userEvent.click(screen.getByRole("button", { name: "Dépense" }));
    const depenseBtn = screen.getByRole("button", { name: "Dépense" });
    expect(depenseBtn.style.backgroundColor).toBe("var(--primary)");
  });

  it("renders the category select with options", () => {
    render(<QuickTransaction />);
    const selects = screen.getAllByRole("combobox");
    // First select = category
    expect(selects[0]).toBeInTheDocument();
    expect(screen.getByText("Alimentation")).toBeInTheDocument();
  });

  it("renders the account select with options", () => {
    render(<QuickTransaction />);
    expect(screen.getByText("Attijari Principal")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<QuickTransaction />);
    expect(
      screen.getByRole("button", { name: /Enregistrer/i })
    ).toBeInTheDocument();
  });
});
