import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { API_ServerLiveStream, BASE_API_URL } from "../env.dev";
import { sendReq } from "../auth/Login";

const url_getlisttreamfollow = `${BASE_API_URL}${API_ServerLiveStream.GETLIST_STREAM_FOLLOW}`;

const ViewerComponent = () => {
    const [streamFollow, setStreamFollow] = useState();
    const [srcIframTag, setSrcIframTag] = useState();
    
    useEffect(() => {
        const fetchData = async () => {
            const res = await sendReq(url_getlisttreamfollow);
            if(res.ok){
                const dataRes = await res.json();
                return setStreamFollow(dataRes);
            }
            return alert('Lấy danh sách stream theo dỗi lỗi!');
        }

        fetchData();
    }, []);

    useEffect(() => {}, [srcIframTag]);

    const handleViewStream = async (streamid) => {
        try {
            const url_viewStream = `${BASE_API_URL}${API_ServerLiveStream.GET_STREAMKEY.replace(':streamid', streamid)}`;
            const res = await sendReq(url_viewStream);
            if(res.ok){
                const dataRes = await res.json();
                return setSrcIframTag(dataRes);
            }
            return alert('Lỗi trong quá trìn xử lý xem stream!');
        } catch (error) {
            console.log('handleViewStream Error: ', error);
        }
    }

    console.log('streamFollow: ', streamFollow)
    console.log('setIfram: ', srcIframTag)
    return(
        <div className="wrap-container-main">
            <div className="container-view-stream">
                <h1>View Stream</h1>
                <iframe src={srcIframTag} frameborder="0"></iframe>
            </div>
            <div className="container-stream-follow">
                <h3>Danh sách theo dõi</h3>
                {
                    (streamFollow?.length && streamFollow?.length>=0)?
                    streamFollow.map(items => {
                        const user = items.users;
                        const stream = items.streams;
                        return(
                            <>
                                <div className="area-info-streamer" onClick={() => handleViewStream(items.streams.id)}>
                                    <img src={user.avatar} alt="avatar" />
                                    <div>{user.username}</div>
                                    <div>{stream.id}</div>
                                </div>
                            </>
                        )
                    }):
                    <>
                        <span>Chưa theo dõi stream nào!</span>
                    </>
                }
            </div>
        </div>
    )
}

export default ViewerComponent;