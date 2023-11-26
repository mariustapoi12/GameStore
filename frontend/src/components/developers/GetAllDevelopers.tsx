import {useEffect, useState} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Container,
    Button,
    Typography,
    List,
    ListItem,
    TextField,
    CircularProgress,
    TableSortLabel
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"
import {Link} from "react-router-dom";
import {BACKEND_API_URL} from "../../constants";
import { Developer } from "../../models/Developer";
import Pagination from "../pagination/Pagination";

function GetAllDevelopers() {
    const [develpoers,
        setDevelopers] = useState < Developer[] > ([]);
    const [loading,
        setLoading] = useState(false);
    const [currentPage,
        setCurrentPage] = useState(1);
    const [sortOrder,
        setSortOrder] = useState < "asc" | "desc" > ("asc");
    const [count,
        setCount] = useState(1);
    const [pageVal, setPageVal] = useState(1);

    const handleSort = () => {
        setSortOrder(sortOrder === "asc"
                ? "desc"
                : "asc");
        if (sortOrder == "asc") {
            develpoers.sort((a, b) => a.revenue - b.revenue);
        } else {
            develpoers.sort((b, a) => a.revenue - b.revenue);
        }

    };

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_API_URL}/developers/count`)
            .then(res => res.json())
            .then(data => setCount(data));
        fetch(`${BACKEND_API_URL}/developers/byPage/${currentPage - 1}`)
            .then(res => res.json())
            .then(data => {
                setDevelopers(data)
                setLoading(false);
            });
    }, [currentPage]);

    return (
        <Container sx={{
            marginTop: "40px",
        }}>
            <Typography variant="h3" color="black" align="left">All Developers</Typography>
            {(
                <List
                    sx={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "1px"
                }}>
                    <ListItem sx={{
                        width: "auto"
                    }}>
                        <Button variant="outlined" component={Link} to={`/developers/add`}>
                            + Add a new developer
                        </Button>
                    </ListItem>
                </List>
            )}
            {!loading && (
                <TableContainer component={Paper} >
                    <List
                        sx={{
                        display: "flex",
                        flexDirection: "row",
                        padding: "1px"
                    }}>
                        <ListItem>
                            <Pagination
                                onPageChange={(page : number) => setCurrentPage(page)}
                                totalCount={count}
                                currentPage={currentPage}
                                pageSize={10}
                                className="pagination-bar"/>
                        </ListItem>
                        <ListItem>
                            <TextField
                                id="page"
                                label="Page:"
                                type="number"
                                sx={{
                                mb: 2
                            }}
                                onChange={(event) => {
                                    setPageVal(Number(event.target.value));
                                }}
                                onKeyDown={(event) => {
                                if (event.key === "Enter") 
                                    setCurrentPage(pageVal);
                                }}></TextField>
                        </ListItem>
                    </List>
                    <Table>
                        <TableHead
                            sx={{
                            backgroundColor: '#F5F5F5'
                        }}>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>
                                    Name
                                </TableCell>
                                <TableCell>
                                    HQ
                                </TableCell>
                                <TableCell>
                                    Publisher
                                </TableCell>
                                <TableCell>
                                    Founded In
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction={sortOrder}
                                        onClick={() => handleSort()}>
                                        Revenue
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    Games
                                </TableCell>
                                <TableCell>Operations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {develpoers.map((developer : Developer, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{developer.name}</TableCell>
                                    <TableCell>{developer.hq}</TableCell>
                                    <TableCell>{developer.publisher}</TableCell>
                                    <TableCell>{developer.foundedIn}</TableCell>
                                    <TableCell>{developer.revenue}</TableCell>
                                    <TableCell>{developer.gamesCount}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            component={Link}
                                            sx={{
                                            mr: 3
                                        }}
                                            to={`/developers/delete/${developer.id}`}>
                                            <Tooltip title="Delete" arrow>
                                                <DeleteForeverIcon
                                                    sx={{
                                                    color: "red"
                                                }}/>
                                            </Tooltip>
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            sx={{
                                            mr: 3
                                        }}
                                            to={`/developers/update/${developer.id}`}>
                                            <Tooltip title="Update" arrow>
                                                <EditIcon/>
                                            </Tooltip>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <List
                        sx={{
                        display: "flex",
                        flexDirection: "row",
                        padding: "1px"
                    }}>
                        <ListItem>
                            <Pagination
                                onPageChange={(page : number) => setCurrentPage(page)}
                                totalCount={count}
                                currentPage={currentPage}
                                pageSize={10}
                                className="pagination-bar"/>
                        </ListItem>
                        <ListItem>
                            <TextField
                                id="page"
                                label="Page:"
                                type="number"
                                value={pageVal}
                                sx={{
                                mb: 2
                            }}
                                onChange={(event) => {
                                    setPageVal(Number(event.target.value));
                                }}
                                onKeyDown={(event) => {
                                if (event.key === "Enter") 
                                    setCurrentPage(pageVal);
                                }}></TextField>
                        </ListItem>
                    </List>
                </TableContainer>
            )}
        </Container>
    );
}

export default GetAllDevelopers