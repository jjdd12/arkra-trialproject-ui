import * as React from 'react';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
// @ts-ignore
import Plot from 'react-plotly.js';
import {
    AppBar,
    Container,
    FormControl,
    InputLabel,
    MenuItem, Select,
    Toolbar,
    Typography
} from "@mui/material";
import {DateRangePicker, LocalizationProvider} from "@mui/x-date-pickers-pro";
import symbol from "./symbol";
import {useQuery} from "@tanstack/react-query";


const StyledInputBase = styled(DateRangePicker)(({theme}) => ({
    color: 'secondary',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        margin: theme.spacing(1, 1, 1, 8),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '9ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));


export default function RowAndColumnSpacing() {

    // Queries
    const [request, setRequest] = React.useState(
        {"base": "EUR", "target": "EUR", "from": "2023-01-01", "to": "2023-01-01"});
    const {data, isError,} = useQuery({
        queryKey: [`api/v1/currency/historical/${request.base}/${request.from}/${request.to}`]
    })
    const OnBaseChange = (event: any) => {
        setRequest({...request, "base": event.target.value});
    }
    const OnTargetChange = (event: any) => {
        setRequest({...request, "target": event.target.value});
    }
    const OnDatesChange = (event: any) => {
        setRequest({...request, "from": event[0]?.format("YYYY-MM-DD"), "to": event[1]?.format("YYYY-MM-DD")});
    }
    let x: any[] = [];
    let y: any[] = [];

    if (Array.isArray(data) && !isError) {
        const filtered = data.filter((d: any) => d.targetCurrency === request.target)
        // @ts-ignore
        x = filtered?.map((d: any) => d.date);
        // @ts-ignore
        y = filtered?.map((d: any) => d.rate);
    }
    return (
        <Container fixed>
            <AppBar>
                <Toolbar>

                    <Typography style={{"padding": "10px"}} variant="h6" sx={{flexGrow: 1}} justifyContent="center"
                                display="flex" component="div" alignItems={"center"}>
                        <Grid container md={4} alignItems={"center"}>
                            <Grid md={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="base">Base</InputLabel>
                                    <Select
                                        labelId="base"
                                        id="base"
                                        value={request["base"]}
                                        label="Base"
                                        onChange={OnBaseChange}
                                    >
                                        {symbol.map(s => <MenuItem value={s}>{s}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid md={2}>

                                <FormControl fullWidth>
                                    <InputLabel id="target">Target</InputLabel>
                                    <Select
                                        labelId="target"
                                        id="target"
                                        value={request["target"]}
                                        label="Target"
                                        onChange={OnTargetChange}
                                    >
                                        {symbol.map(s => <MenuItem value={s}>{s}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <StyledInputBase onChange={(evt) => OnDatesChange(evt)}
                                             localeText={{start: 'From', end: 'To'}}/>
                        </LocalizationProvider>
                    </Typography>
                </Toolbar>

            </AppBar>
            <Toolbar/>
            <Box sx={{width: '100%', marginTop: '80px'}}>
                <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                    <Grid xs={12}>
                        {x.length > 0 && y.length > 0  ? (
                            <Plot
                                data={[{
                                    x: x,
                                    y: y,
                                    type: 'scatter',
                                    mode: 'lines+markers',
                                    marker: {color: 'red'},
                                }]}
                                layout={{
                                    width: 1200,
                                    height: 600,
                                    title: {text: `${request.base} to ${request.target}`}
                                }}
                            />) : (
                            <Typography style={{"padding": "10px", "fontSize": "40px"}} variant="h6" sx={{flexGrow: 1}} justifyContent="center"
                                        display="flex" component="div" alignItems={"center"}>
                                No Data
                            </Typography>)
                        }
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}