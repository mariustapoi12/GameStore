import {useEffect, useState} from "react";
import {Game} from "../../models/Game";
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
import Pagination from "../pagination/Pagination";

function GetAllGames() {
    const [games,
        setGames] = useState < Game[] > ([]);
    const [loading,
        setLoading] = useState(false);
    const [price,
        setPrice] = useState(-1);
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
            games.sort((a, b) => a.yearOfRelease - b.yearOfRelease);
        } else {
            games.sort((b, a) => a.yearOfRelease - b.yearOfRelease);
        }

    };

    const handlePriceTextFIeld = (event : React.ChangeEvent < HTMLInputElement | HTMLTextAreaElement >) => {
        const inputtedPrice = Number(event.target.value);
        if (!isNaN(inputtedPrice)) {
            setPrice(Number(inputtedPrice));
        } else {
            setPrice(-1);
        }
    }

    useEffect(() => {
        setLoading(true);
        
        if (price == -1) {
            fetch(`${BACKEND_API_URL}/games/count`)
                .then(res => res.json())
                .then(data => setCount(data));
            fetch(`${BACKEND_API_URL}/games/byPage/${currentPage - 1}`)
                .then(res => res.json())
                .then(data => {
                    setGames(data);
                    setLoading(false);
                })
        } else {
            fetch(`${BACKEND_API_URL}/games/getWithPriceHigherThan/${currentPage}?price=${price}`)
                .then(res => res.json())
                .then(data => {
                    setGames(data);
                    setLoading(false);
                })
        }
    }, [price, currentPage]);
    return (
        <Container sx={{
            marginTop: "40px",
        }}>
            <Typography variant="h3" color="black" align="left">All Games</Typography>
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
                        <Button variant="outlined" component={Link} to={`/games/add`}>
                            + Add a new game
                        </Button>
                    </ListItem>
                    <ListItem sx={{
                        width: "auto"
                    }}>
                        <TextField
                            id="filter"
                            label="Having a price higher than:"
                            fullWidth
                            sx={{
                            mb: 2
                        }}
                            onChange={(event) => {
                            handlePriceTextFIeld(event);
                        }}></TextField>
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
                                    Genre
                                </TableCell>
                                <TableCell>
                                    Modes
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        direction={sortOrder}
                                        onClick={() => handleSort()}>
                                        Year of Release
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    Price
                                </TableCell>
                                <TableCell>
                                    Descritpion
                                </TableCell>
                                <TableCell>
                                    Developer
                                </TableCell>
                                <TableCell>
                                    Bought Games
                                </TableCell>
                                <TableCell>Operations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {games.map((game : Game, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{game.name}</TableCell>
                                    <TableCell>{game.genre}</TableCell>
                                    <TableCell>{game.modes}</TableCell>
                                    <TableCell>{game.yearOfRelease}</TableCell>
                                    <TableCell>{game.price}</TableCell>
                                    <TableCell>{game.description}</TableCell>
                                    <TableCell>{game.developerEntity.name}</TableCell>
                                    <TableCell>{game.totalNumberOfBoughtQuantity}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            component={Link}
                                            sx={{
                                            mr: 3
                                        }}
                                            to={`/games/delete/${game.id}`}>
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
                                            to={`/games/update/${game.id}`}>
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

export default GetAllGames
