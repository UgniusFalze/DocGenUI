import { Box, Button, ButtonGroup, Container, FormControl, Paper, Stack, TextField, Typography } from "@mui/material"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { useEditUser, useUserProfile } from "../../utils/apiService";
import { UserForm } from "../../types/user";
import { useAuth } from "react-oidc-context";
import { SuccessToast } from "../toasts/SuccessToast";
import { useEffect, useState } from "react";
import { getLoginServiceUrl } from "../../utils/envProvider";
import { useLocation } from "react-router-dom";

export const ViewProfile = () => {
    const user = useAuth();
    let location = useLocation();
    const formMutation = useEditUser(user.user?.access_token);
    const userProfile = useUserProfile(user.user!.access_token);
    const [successfullSubmit, setSuccessfullSubmit] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const userRegisterForm = useForm<UserForm>({
        defaultValues: {
            address: "",
            personalId: "",
            freelanceWorkId: "",
            bankNumber: "",
            bankName: "",
        },
        values: userProfile.data,
        mode: "onChange"
    });

    const redirectToUserSettings = () => {
        window.location.href = getLoginServiceUrl() + '/account';
    }


    const onSubmit: SubmitHandler<UserForm> = async (data) => {
        //const _ = userRegisterForm.formState.errors;
        await userRegisterForm.trigger();
        if (userRegisterForm.formState.isValid) {
            formMutation.mutate(data);
        }
    };


    useEffect(() => {
        if (formMutation.isSuccess) {
            setHasError(false);
            setSuccessfullSubmit(true);
        } else if (formMutation.isError) {
            setSuccessfullSubmit(false);
            setHasError(true);
        }
    }, [formMutation.isSuccess, formMutation.isError]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <SuccessToast open={successfullSubmit} onClose={() => setSuccessfullSubmit(false)} />
            <Stack
                sx={{
                    height: "min-content",
                    width: '100%'
                }}
                direction={'column'}
                gap={2}
            >
                <Paper elevation={1}>
                    <Stack direction={'row'} sx={{ padding: "1rem" }}>
                        <Box>
                            <Typography variant="h5" component="div">
                                Personal Information
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Update your personal information here
                            </Typography>
                        </Box>
                        <Container sx={{ width: "60%", marginRight: "0" }}>
                            <Paper elevation={3}>
                                <form onSubmit={userRegisterForm.handleSubmit(onSubmit)}>
                                    <Stack
                                        sx={{
                                            padding: "2em",
                                        }}
                                        gap={2}
                                    >
                                        <Controller
                                            name="address"
                                            control={userRegisterForm.control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <TextField
                                                        {...field}
                                                        error={!!userRegisterForm.formState.errors.address}
                                                        label="Home Address"
                                                        variant="outlined"
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                        <Controller
                                            name="personalId"
                                            control={userRegisterForm.control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <TextField
                                                        {...field}
                                                        error={!!userRegisterForm.formState.errors.personalId}
                                                        label="National Identification Number"
                                                        variant="outlined"
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                        <Controller
                                            name="freelanceWorkId"
                                            control={userRegisterForm.control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <TextField
                                                        {...field}
                                                        error={
                                                            !!userRegisterForm.formState.errors.freelanceWorkId
                                                        }
                                                        label="Freeelance Work Id"
                                                        variant="outlined"
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                        <Controller
                                            name="bankNumber"
                                            control={userRegisterForm.control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <TextField
                                                        {...field}
                                                        error={!!userRegisterForm.formState.errors.bankNumber}
                                                        label="Bank Account Number"
                                                        variant="outlined"
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                        <Controller
                                            name="bankName"
                                            control={userRegisterForm.control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <TextField
                                                        {...field}
                                                        error={!!userRegisterForm.formState.errors.bankName}
                                                        label="Bank Name"
                                                        variant="outlined"
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                        <ButtonGroup variant="text" sx={{ justifyContent: 'flex-end' }}>
                                            <Button
                                                type="submit"
                                            >
                                                Save
                                            </Button>
                                        </ButtonGroup>
                                    </Stack>
                                </form>
                            </Paper>
                        </Container>
                    </Stack>
                </Paper>
                <Paper elevation={1}>
                    <Stack direction={'row'} sx={{ padding: "1rem", justifyContent:'space-between' }}>
                        <Box>
                            <Typography variant="h5" component="div">
                                Account Settings
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Change Account Settings On Keycloak
                            </Typography>
                        </Box>
                        <Button variant="outlined" onClick={redirectToUserSettings}>
                            Account Settings
                        </Button>
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    )
}