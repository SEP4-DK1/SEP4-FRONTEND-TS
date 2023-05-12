import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CollapsibleMenu from "./CollapsibleMenu";

test("Show/hide menu on click", async () => {
  render(<CollapsibleMenu />);

  const hamburger = screen.getByRole("button");

  expect(screen.queryByText("Link 1")).not.toBeInTheDocument();

  userEvent.click(hamburger);

  await waitFor(() => {
    expect(screen.getByText("Link 1")).toBeInTheDocument();
  });

  userEvent.click(hamburger);

  await waitFor(() => {
    expect(screen.queryByText("Link 1")).not.toBeInTheDocument();
  });
});
