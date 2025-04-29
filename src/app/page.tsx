import { Box, Button, Card, Typography, Grid } from "@mui/material";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import AvatarDropDown from "@/components/Header/AvatarDropDown";

export default function DashboardPage() {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 6 },
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box maxWidth={"xl"}>
        {/* Header */}
        <Box
          sx={{
            mb: 6,
            display: "flex",
            width: "100%",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back 👋
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage your documents and users efficiently.
            </Typography>
          </Box>
          <AvatarDropDown />
        </Box>

        {/* Cards */}
        <Grid container spacing={4}>
          {[
            {
              title: "Documents",
              description:
                "Manage, upload, and organize all your important files.",
              link: ROUTES.DASHBOARD_DOCS,
              emoji: "📄",
            },
            {
              title: "Users",
              description:
                "Handle user accounts, permissions, and roles easily.",
              link: ROUTES.DASHBOARD_USERS,
              emoji: "👥",
            },
            {
              title: "Profile",
              description: "Update your account settings and preferences.",
              link: ROUTES.DASHBOARD,
              emoji: "⚙️",
            },
          ].map((item) => (
            <Grid
              size={{
                xs: 12,
                sm: 6,
                lg: 4,
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              key={item.title}
            >
              <Link
                href={item.link}
                passHref
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Card
                  sx={{
                    minHeight: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    borderRadius: 4,
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 30px rgba(3, 3, 3, 0.12)",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Typography variant="h2" mb={1}>
                    {item.emoji}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" px={2}>
                    {item.description}
                  </Typography>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box
          sx={{
            mt: 8,
            p: 6,
            borderRadius: 6,
            textAlign: "center",
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
            color: "#fff",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Ready to upload your first document?
          </Typography>
          <Typography variant="body1" mb={4}>
            Click below and start managing your documents more efficiently.
          </Typography>
          <Link href={ROUTES.DASHBOARD_DOCS} passHref>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#ffffff",
                color: "#2575fc",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              Upload Document
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
