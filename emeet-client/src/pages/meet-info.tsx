import { ChangeEvent, useEffect, useState } from 'react';
import { Grid, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import MeetInfoCard from '../components/meetinfo-card';
import MeetInfo from '../models/MeetInfo';
import Repo from '../repositories'
import MeetAppbar from '../components/app-bar';

function MeetInfoList() {
    const [meetInfoList, setMeetInfoList] = useState<MeetInfo[]>([])
    const [selectFilter, setSelectFilter] = useState('')
    const [searchFilter, setSearchFilter] = useState('')

    const onUpdateMeetInfo = (meetInfo: MeetInfo) => {
        setMeetInfoList(prevMeetInfoList => prevMeetInfoList.map(item => item.id === meetInfo.id ? meetInfo : item))}

    const fetchMeetInfoList = async () => {
        let params: { keyword?: string, isPinned?: boolean } = {}
        if (searchFilter) {
            params.keyword = searchFilter
        }
        const result = await Repo.meetInfo.getAll(params)
        if (result) {
            if (meetInfoList.length) {
                setMeetInfoList([])
            }
            setMeetInfoList(result)
        } 
    }

    const handleChangeSelectFilter = (event: SelectChangeEvent) => {
        setSelectFilter(event.target.value)
    }

    const handleChangeSearchFilter = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value)
    }

    useEffect(() => {
        fetchMeetInfoList()
    }, [selectFilter, searchFilter])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <MeetAppbar></MeetAppbar>
            <Select
            sx={{ m: 2, minWidth: 120 }}
            value={selectFilter}
            onChange={handleChangeSelectFilter}
            displayEmpty 
            >
                <MenuItem value=''>
                    All
                </MenuItem>
                <MenuItem value={1}>Pinned</MenuItem>
            </Select>
            <TextField sx={{ m: 2, minWidth: 120 }} label="Search" placeholder="Topic" variant="outlined" value={searchFilter} onChange={handleChangeSearchFilter} />
            {meetInfoList.length
              ?
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12, lg: 12, xl: 10}}>
                {meetInfoList.map((meetInfo, index) => 
                    <Grid item xs={2} sm={4} md={4} lg={3} xl={2} key={index}>
                        <MeetInfoCard meetInfo={meetInfo} onUpdateMeetInfo={onUpdateMeetInfo}></MeetInfoCard>
                    </Grid>
                )}
              </Grid>
              :
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400}}>
                <Typography variant='body2' color='text.secondary'>No Result Found</Typography>
              </Box>
            }
        </Box>
    )
}

export default MeetInfoList