import { Box, Button, Card, CardActions, CardContent, CssBaseline, Typography } from "@mui/material"

export const UnreachableAuth = () => {
    return (
        <Box sx={{ display: "flex", justifyContent:"center", alignContent:"center", height:"100vh"}}>
            <CssBaseline />
            <Box sx={{alignContent:"center"}}>
                <Card variant="outlined">
                    <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Failed to connect to login service...
                    </Typography>
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </CardActions>
                </Card>
            </Box>
        </Box>
    )
}