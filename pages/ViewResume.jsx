import { StyleSheet, Text, View, ScrollView, Linking } from 'react-native'
import React, { useState, useEffect } from 'react';
import { ResumeDetailsByTalentID, TalentDetailsById } from '../api';

const ViewResume = ({ route, navigation }) => {
  //const { talent_id, resume_id } = route.params;
  const talent_id = '21e3369b-f853-41e9-aa02-7a08c7531646'
  const [details, setDetails] = useState([]);
  const [talentDetails, setTalentDetails] = useState([]);
  const [fetch, setFetch] = useState(false);

  useEffect(() => {
    if (talent_id) {
      ResumeDetailsByTalentID(talent_id).then((res) => {
        if (res.status) {
          setDetails(res.data[0]);
        }
      })
      TalentDetailsById(talent_id).then((res) => {
        if (res.status) {
          setTalentDetails(res.data[0]);
          //console.log(res.data[0]);
        }
      })
    }
  }, [fetch])

  const WebLink = ({ url }) => {
    const handleLinkPress = () => {
      // Open the web link in the default browser
      Linking.openURL(url);
    };

    return (
      <Text onPress={handleLinkPress} style={{ color: '#407BFF' }}>
        Click Here
      </Text>
    );
  };

  return (
    <ScrollView>
      <View style={{ width: '96%', margin: 10, backgroundColor: 'white', borderRadius: 10, padding: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.header}>{talentDetails.firstname} {talentDetails.lastname}</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.normal}>{talentDetails.email}</Text>
            {talentDetails.contactno && <Text style={styles.normal}>+91 {talentDetails.contactno}</Text>}
            {talentDetails.city && <Text style={styles.normal}>{talentDetails.city}</Text>}
          </View>
        </View>
        <View style={styles.divider} />
        <View>
          {
            details.education && <View>
              <Text style={styles.header1}>Education</Text>
              {
                details.education.map((item, index) => (
                  <View key={index} style={{ margin: 10 }}>
                    {item.level == "10th" || item.level == "12th" ?
                      <View>
                        <Text style={styles.name}> ❖ {item.school} - {item.board}</Text>
                        {item.level == "10th" ? <Text style={styles.normal}>X (secondary)</Text> :
                          <Text style={styles.name}>XII (senior secondary)</Text>
                        }
                      </View>
                      : ''}
                    {item.level == "ug/pg" || item.level == "diploma" || item.level == "phd" ?
                      <View>
                        {item.level == "ug/pg" || item.level == "phd" ? <Text style={styles.name}> ❖ {item.degree} - {item.stream}</Text> : item.level == "diploma" && <Text style={styles.name}> ❖ {item.stream} - Diploma</Text>}
                        <Text style={styles.normal}>{item.college} {item.startYear} - {item.endYear}</Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.normal}>{item.performance}</Text>
                          {item.performanceScale === "cgpa(/10)" ? <Text>/10 CGPA</Text> :
                            item.performanceScale = "cgpa(/9)" ? <Text style={styles.normal}>/9 CGPA</Text> :
                              item.performanceScale = "cgpa(/8)" ? <Text style={styles.normal}>/8 CGPA</Text> :
                                item.performanceScale = "cgpa(/7)" ? <Text style={styles.normal}>/7 CGPA</Text> :
                                  item.performanceScale = "cgpa(/6)" ? <Text style={styles.normal}>/6 CGPA</Text> :
                                    item.performanceScale = "cgpa(/5)" ? <Text style={styles.normal}>/5 CGPA</Text> :
                                      item.performanceScale = "cgpa(/5)" ? <Text style={styles.normal}>/5 CGPA</Text> :
                                        item.performanceScale = "percentage" ? <Text style={styles.normal}>%</Text> : ""}
                        </View>
                      </View> : ''}
                    {item.level == "10th" || item.level == "12th" ? <Text style={styles.normal}>{item.yearofCompletion} - {item.performance}</Text> : ''}
                  </View>
                ))
              }
            </View>
          }
          <View style={styles.divider} />
          {
            details.skill &&
            <View>
              <Text style={styles.header1}>Skills</Text>
              <View>
                {
                  details.skill.map((item, index) => (
                    <View style={{ margin: 10 }} key={index}>
                      <Text style={styles.name}> ❖ {item.skill_type}</Text>
                      <Text>{item.skills_list}</Text>
                    </View>
                  ))
                }
              </View>
            </View>
          }
          <View style={styles.divider} />
          {
            details.project &&
            <View>
              <Text style={styles.header1}>Projects</Text>
              <View>
                {
                  details.project.map((item, index) => (
                    <View style={{ margin: 10 }} key={index}>
                      <Text style={styles.name}> ❖ {item.title}</Text>
                      <Text style={{ fontStyle: 'italic', color: 'gray' }}>{item.requirements}</Text>
                      <Text style={styles.description}>{item.description}</Text>
                      <WebLink url={item.url} />
                    </View>
                  ))
                }
              </View>
            </View>
          }
          <View style={styles.divider} />
          {
            details.internship &&
            <View>
              <Text style={styles.header1}>Internships</Text>
              <View>
                {
                  details.internship.map((item, index) => (
                    <View style={{ margin: 10 }} key={index}>
                      <Text style={styles.name}> ❖ {item.position} - {item.organization}</Text>
                      <Text style={{ color: 'gray' }}>{item.location}</Text>
                      <Text >{item.startDate} - {item.endDate}</Text>
                      <Text style={styles.description}>{item.description}</Text>
                    </View>
                  ))
                }
              </View>
            </View>
          }
          <View style={styles.divider} />
          {
            details.job &&
            <View>
              <Text style={styles.header1}>Experience</Text>
              <View>
                {
                  details.job.map((item, index) => (
                    <View style={{ margin: 10 }} key={index}>
                      <Text style={styles.name}> ❖ {item.position} - {item.organization}</Text>
                      <Text style={{ color: 'gray' }}>{item.location}</Text>
                      <Text >{item.startDate} - {item.endDate}</Text>
                      <Text style={styles.description}>{item.description}</Text>
                    </View>
                  ))
                }
              </View>
            </View>
          }
          <View style={styles.divider} />
          {
            details.position_of_responsibility &&
            <View>
              <Text style={styles.header1}>Position of Responsiibility</Text>
              <View>
                {
                  details.position_of_responsibility.map((item, index) => (
                    <View style={{ margin: 10 }} key={index}>
                      <Text style={styles.description}> ❖ {item.description}</Text>
                    </View>
                  ))
                }
              </View>
            </View>
          }
          <View style={styles.divider} />
          {
            details.accomplishment &&
            <View>
              <Text style={styles.header1}>Accomplishments</Text>
              <View>
                {
                  details.accomplishment.map((item, index) => (
                    <View style={{ margin: 10 }} key={index}>
                      <Text style={styles.name}> ❖ {item.title}</Text>
                      <Text style={styles.description}>{item.description}</Text>
                      {item.url && <WebLink url={item.url} />}
                    </View>
                  ))
                }
              </View>
            </View>
          }
        </View>
      </View>
    </ScrollView>
  )
}

export default ViewResume

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  header1: {
    fontSize: 16,
    color: 'gray'
  },
  normal: {
    fontSize: 14
  }, divider: {
    margin: 5,
    borderBottomColor: '#407BFF',
    borderBottomWidth: 1,
  }, name: {
    fontSize: 14,
    fontWeight: 'bold'
  }, description: {
    fontSize: 14,
  }
})