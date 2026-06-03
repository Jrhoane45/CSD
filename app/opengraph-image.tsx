import { ImageResponse } from "next/og";

export const alt = "Club Sports Direct — Team Sports, Simplified";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded social/Open Graph preview, generated at build time.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#14264f",
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(200,16,46,0.35), transparent 42%), radial-gradient(circle at 88% 82%, rgba(245,168,0,0.20), transparent 45%)",
          padding: "68px 72px",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        {/* top: badge + wordmark */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              width: 132,
              height: 132,
              borderRadius: 66,
              backgroundColor: "#0e1b3a",
              border: "7px solid #c8102e",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 4px rgba(255,255,255,0.12)",
            }}
          >
            <div style={{ fontSize: 56, fontWeight: 800, fontStyle: "italic", color: "#ffffff" }}>
              CSD
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 28 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#ffce5c", letterSpacing: 6 }}>
              TEAM SPORTS, SIMPLIFIED
            </div>
            <div style={{ fontSize: 58, fontWeight: 800, color: "#ffffff", letterSpacing: 1 }}>
              CLUB SPORTS DIRECT
            </div>
          </div>
        </div>

        {/* middle: value prop */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: "#ffffff" }}>
            <div>Find the right place to&nbsp;</div>
            <div style={{ color: "#f5a800" }}>grow.</div>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#efe9db", marginTop: 22, maxWidth: 980 }}>
            Vetted, data-driven matching that connects youth athletes to the right clubs, trainers &amp;
            advisers — on development level, not word-of-mouth.
          </div>
        </div>

        {/* bottom: url + category pills */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#ffce5c" }}>clubsportsdirect.com</div>
          <div style={{ display: "flex" }}>
            {["Discovery", "CSD Score™", "Matching"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontSize: 22,
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 999,
                  padding: "8px 20px",
                  marginLeft: 12,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
