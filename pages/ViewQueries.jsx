import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { AllQueryById } from '../api';
import { calculateTimeAgo } from '../components/commonFunctions';

const ViewQueries = () => {
    const id = 'e35147fb-b336-4858-9dc1-2438a5524a7c';
    const [query, setQuery] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        AllQueryById(id).then((res) => {
            if (res.status) {
                setQuery(res.data.sort((a, b) => {
                    const datetimeA = new Date(a.created_at);
                    const datetimeB = new Date(b.created_at);
                    return datetimeB - datetimeA;
                }))
            }
            setLoading(false);
        })
    }, [])

    return (
        <ScrollView>
            {loading ? <View style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <ActivityIndicator size="large" color="#407BFF" />
            </View> : <>
                {query && query.length > 0 ?
                    <View>
                        {query.map((item) => <View style={{ backgroundColor: 'white', width: '95%', minHeight: 50, padding: 10, margin: 10, borderRadius: 10 }} key={item.query_id}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}> {calculateTimeAgo(item.created_at)}</Text>
                            <View style={styles.divider} />
                            <Text style={{ fontSize: 16 }}>Query: {item.message}</Text>
                            {item.reply && <Text style={{ fontSize: 16, marginTop: 5 }}>Reply: {item.reply}</Text>}
                        </View>)}
                    </View> :
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../assets/Nodata.png')}
                            style={{ width: 200, height: 200 }}
                        />
                        <Text>No queries yet.</Text>
                    </View>
                }
            </>
            }
        </ScrollView>
    )
}

export default ViewQueries

const styles = StyleSheet.create({
    divider: {
        marginTop: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
})