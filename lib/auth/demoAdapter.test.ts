import { describe, it, expect } from "vitest";
import { demoAdapter } from "./demoAdapter";

describe("demoAdapter (session composition)", () => {
  it("signs in, switches role, and signs out with notifications", async () => {
    let notifications = 0;
    const unsub = demoAdapter.subscribe(() => {
      notifications++;
    });

    expect(demoAdapter.getState().user).toBeNull();

    const user = await demoAdapter.signIn({ email: "coach@example.com" });
    expect(user.email).toBe("coach@example.com");
    expect(user.name).toBe("coach"); // derived from the email local-part
    expect(demoAdapter.getState().user?.email).toBe("coach@example.com");

    demoAdapter.setRole("provider");
    expect(demoAdapter.getState().role).toBe("provider");
    expect(demoAdapter.getState().user?.role).toBe("provider");

    await demoAdapter.signOut();
    expect(demoAdapter.getState().user).toBeNull();

    expect(notifications).toBeGreaterThan(0);
    unsub();
  });

  it("returns a stable snapshot reference between unchanged reads", () => {
    const a = demoAdapter.getState();
    const b = demoAdapter.getState();
    expect(a).toBe(b); // required for useSyncExternalStore
  });
});
