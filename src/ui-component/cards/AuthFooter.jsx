import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2" component={Link} href="https://tikurcreatives.com" target="_blank" underline="hover">
                tikurcreatives.com
            </Typography>
            <Typography variant="subtitle2" component={Link} href="https://codedthemes.com" target="_blank" underline="hover">
                &copy; {currentYear} tikurcreatives.com
            </Typography>
        </Stack>
    );
};

export default AuthFooter;
