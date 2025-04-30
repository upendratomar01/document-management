import { Box, Button, Typography, Grid } from "@mui/material";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import AvatarDropDown from "@/components/Header/AvatarDropDown";
import { HomeItemCard } from "@/components/Card/HomeItemCard";

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
                "Manage, upload, and organize all your important files easily",
              link: ROUTES.DASHBOARD_DOCS,
              emoji: "📄",
            },
            {
              title: "Users",
              description:
                "Handle all user accounts, permissions, and roles easily.",
              link: ROUTES.DASHBOARD_USERS,
              emoji: "👥",
            },
          ].map((item) => (
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
              display="flex"
              justifyContent="center"
              alignItems="center"
              key={item.title}
            >
              <HomeItemCard
                url={item.link}
                title={item.title}
                desc={item.description}
                emoji={item.emoji}
              />
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
