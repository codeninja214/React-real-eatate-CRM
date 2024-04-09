import { CloseIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Flex, FormLabel, Grid, GridItem, IconButton, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Stack, Text, Textarea } from '@chakra-ui/react';
import ContactModel from "components/commonTableModel/ContactModel";
import LeadModel from "components/commonTableModel/LeadModel";
import Spinner from 'components/spinner/Spinner';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { LiaMousePointerSolid } from 'react-icons/lia';
import { TaskSchema } from 'schema';
import { getApi, postApi } from 'services/api';
import moment from 'moment';
import { putApi } from 'services/api';

const AddEdit = (props) => {
    const { onClose, isOpen, fetchData, userAction, setAction, id } = props
    const [isChecked, setIsChecked] = useState(false);
    const userId = JSON.parse(localStorage.getItem('user'))._id
    const [assignmentToData, setAssignmentToData] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"))
    const [isLoding, setIsLoding] = useState(false)
    const [contactModelOpen, setContactModel] = useState(false);
    const [leadModelOpen, setLeadModel] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const todayTime = new Date().toISOString().split('.')[0];

    const [initialValues, setInitialValues] = useState({
        title: '',
        category: props.leadContect === 'contactView' ? 'Contact' : props.leadContect === 'leadView' ? 'Lead' : 'None',
        description: '',
        notes: '',
        assignmentTo: props.leadContect === 'contactView' && id ? id : '',
        assignmentToLead: props.leadContect === 'leadView' && id ? id : '',
        reminder: '',
        start: '',
        end: '',
        backgroundColor: '',
        borderColor: '#ffffff',
        textColor: '',
        allDay: isChecked === true ? 'Yes' : 'No',
        display: '',
        url: '',
        createBy: userId,
    });
    console.log("initialValues---::", initialValues.start)

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: TaskSchema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            AddData();
            resetForm()
        },
    });

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik

    const AddData = async () => {
        if (userAction === "add") {
            try {
                setIsLoding(true)

                if (values?.start) {
                    values.start = isChecked ? moment(values.start).format('YYYY-MM-DD') || '' : moment(values.start).format('YYYY-MM-DD HH:mm') || '';
                }
                if (values?.end) {
                    values.end = isChecked ? moment(values.end).format('YYY-MM-DD') || '' : moment(values.end).format('YYYY-MM-DD HH:mm') || '';
                }

                let response = await postApi('api/task/add', values)
                if (response.status === 200) {
                    formik.resetForm()
                    onClose();
                    fetchData()
                }
            } catch (e) {
                console.log(e);
            }
            finally {
                setIsLoding(false)
            }
        } else if (userAction === "edit") {
            try {
                setIsLoding(true)

                if (values?.start) {
                    values.start = isChecked ? moment(values.start).format('YYYY-MM-DD') || '' : moment(values.start).format('YYYY-MM-DD HH:mm') || '';
                }
                if (values?.end) {
                    values.end = isChecked ? moment(values.end).format('YYYY-MM-DD') || '' : moment(values.end).format('YYYY-MM-DD HH:mm') || '';
                }

                let response = await putApi(`api/task/edit/${id}`, values)
                if (response.status === 200) {
                    formik.resetForm()
                    onClose();
                    setAction((pre) => !pre)
                }
            } catch (e) {
                console.log(e);
            }
            finally {
                setIsLoding(false)
            }
        }
    };
    const fetchTaskData = async () => {
        if (id) {
            try {
                setIsLoding(true)
                let result = await getApi('api/task/view/', id)
                let editData = { ...result?.data }
                editData.allDay = result?.data?.allDay === 'Yes' ? 'Yes' : 'No';
                console.log("result?.data---::", result?.data.start)

                setInitialValues(editData)
                // setFieldValue('title', result?.data?.title)
                // setFieldValue('category', result?.data?.category)
                // setFieldValue('description', result?.data?.description)
                // setFieldValue('notes', result?.data?.notes)
                // setFieldValue('assignmentTo', result?.data?.assignmentTo)
                // setFieldValue('reminder', result?.data?.reminder)
                // setFieldValue('start', result?.data?.start)
                // setFieldValue('end', result?.data?.end)
                // setFieldValue('backgroundColor', result?.data?.backgroundColor)
                // setFieldValue('borderColor', result?.data?.borderColor)
                // setFieldValue('textColor', result?.data?.textColor)
                // setFieldValue('display', result?.data?.display)
                // setFieldValue('url', result?.data?.url)
                // setFieldValue("status", result?.data?.status)
                // setFieldValue('assignmentToLead', result?.data?.assignmentToLead)
                // setFieldValue('allDay', result?.data?.allDay === 'Yes' ? 'Yes' : 'No')

                setIsChecked(result?.data?.allDay === 'Yes' ? true : false)
            }
            catch (e) {
                console.log(e);
            }
            finally {
                setIsLoding(false)
            }
        }
    }

    useEffect(async () => {
        values.start = props?.date
        try {
            let result
            if (values.category === "Contact") {
                result = await getApi(user.role === 'superAdmin' ? 'api/contact/' : `api/contact/?createBy=${user._id}`)
            } else if (values.category === "Lead") {
                result = await getApi(user.role === 'superAdmin' ? 'api/lead/' : `api/lead/?createBy=${user._id}`);
            }
            setAssignmentToData(result?.data)
        }
        catch (e) {
            console.log(e);
        }
    }, [props, values.category])

    useEffect(() => {
        if (userAction === "edit") {
            fetchTaskData()
        } else {
            setInitialValues({
                title: '',
                category: props.leadContect === 'contactView' ? 'Contact' : props.leadContect === 'leadView' ? 'Lead' : 'None',
                description: '',
                notes: '',
                assignmentTo: props.leadContect === 'contactView' && id ? id : '',
                assignmentToLead: props.leadContect === 'leadView' && id ? id : '',
                reminder: '',
                start: '',
                end: '',
                backgroundColor: '',
                borderColor: '#ffffff',
                textColor: '',
                allDay: isChecked === true ? 'Yes' : 'No',
                display: '',
                url: '',
                createBy: userId,
            })
        }
    }, [userAction, id])

    return (
        // <Modal isOpen={isOpen} size={'xl'} >
        //     <ModalOverlay />
        //     <ModalContent height={"600px"}>
        //         <ModalHeader justifyContent='space-between' display='flex' >
        //             Create Task
        //             <IconButton onClick={() => props.from ? onClose(false) : onClose()} icon={<CloseIcon />} />
        //         </ModalHeader>
        //         <ModalBody overflowY={"auto"} height={"700px"}>
        //             {/* Contact Model  */}
        //             <ContactModel isOpen={contactModelOpen} data={assignmentToData} onClose={setContactModel} fieldName='assignmentTo' setFieldValue={setFieldValue} />
        //             {/* Lead Model  */}
        //             <LeadModel isOpen={leadModelOpen} data={assignmentToData} onClose={setLeadModel} fieldName='assignmentToLead' setFieldValue={setFieldValue} />

        //             <Grid templateColumns="repeat(12, 1fr)" gap={3}>
        //                 <GridItem colSpan={{ base: 12, md: 6 }} >
        //                     <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                         Title<Text color={"red"}>*</Text>
        //                     </FormLabel>
        //                     <Input
        //                         fontSize='sm'
        //                         onChange={handleChange}
        //                         onBlur={handleBlur}
        //                         value={values.title}
        //                         name="title"
        //                         placeholder='Title'
        //                         fontWeight='500'
        //                         borderColor={errors?.title && touched?.title ? "red.300" : null}
        //                     />
        //                     <Text mb='10px' fontSize='sm' color={'red'}> {errors.title && touched.title && errors.title}</Text>
        //                 </GridItem>
        //                 <GridItem colSpan={{ base: 12, md: 6 }} >
        //                     <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                         Related
        //                     </FormLabel>
        //                     <RadioGroup onChange={(e) => { setFieldValue('category', e); setFieldValue('assignmentTo', null); setFieldValue('assignmentToLead', null); }} value={values.category}>
        //                         <Stack direction='row'>
        //                             <Radio value='None' >None</Radio>
        //                             {props.leadContect === 'contactView' && <Radio value='Contact'>Contact</Radio>}
        //                             {props.leadContect === 'leadView' && <Radio value='Lead'>Lead</Radio>}
        //                             {!props.leadContect && <> <Radio value='Contact'>Contact</Radio><Radio value='Lead'>Lead</Radio></>}
        //                         </Stack>
        //                     </RadioGroup>
        //                     <Text mb='10px' color={'red'}> {errors.category && touched.category && errors.category}</Text>
        //                 </GridItem>
        //                 <GridItem colSpan={{ base: 12, md: values.category === "None" ? 12 : 6 }} >
        //                     <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                         Description
        //                     </FormLabel>
        //                     <Input
        //                         fontSize='sm'
        //                         onChange={handleChange}
        //                         onBlur={handleBlur}
        //                         value={values.description}
        //                         name="description"
        //                         placeholder='Description'
        //                         fontWeight='500'
        //                         borderColor={errors?.description && touched?.description ? "red.300" : null}
        //                     />
        //                     <Text mb='10px' color={'red'}> {errors.description && touched.description && errors.description}</Text>
        //                 </GridItem>
        //                 {values.category === "Contact" ?
        //                     <>
        //                         <GridItem colSpan={{ base: 12, md: 6 }} >
        //                             <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                                 Assignment To  Contact
        //                             </FormLabel>
        //                             <Flex justifyContent={'space-between'}>
        //                                 <Select
        //                                     value={values.assignmentTo}
        //                                     name="assignmentTo"
        //                                     onChange={handleChange}
        //                                     mb={errors.assignmentTo && touched.assignmentTo ? undefined : '10px'}
        //                                     fontWeight='500'
        //                                     placeholder={'Assignment To'}
        //                                     borderColor={errors.assignmentTo && touched.assignmentTo ? "red.300" : null}
        //                                 >
        //                                     {assignmentToData?.map((item) => {
        //                                         return <option value={item._id} key={item._id}>{values.category === 'Contact' && `${item.firstName} ${item.lastName}`}</option>
        //                                     })}
        //                                 </Select>
        //                                 <IconButton onClick={() => setContactModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
        //                             </Flex>
        //                             <Text mb='10px' color={'red'}> {errors.assignmentTo && touched.assignmentTo && errors.assignmentTo}</Text>
        //                         </GridItem>
        //                     </>
        //                     : values.category === "Lead" ?
        //                         <>
        //                             <GridItem colSpan={{ base: 12, md: 6 }} >
        //                                 <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                                     Assignment To Lead
        //                                 </FormLabel>
        //                                 <Flex justifyContent={'space-between'}>
        //                                     <Select
        //                                         value={values.assignmentToLead}
        //                                         name="assignmentToLead"
        //                                         onChange={handleChange}
        //                                         mb={errors.assignmentToLead && touched.assignmentToLead ? undefined : '10px'}
        //                                         fontWeight='500'
        //                                         placeholder={'Assignment To'}
        //                                         borderColor={errors.assignmentToLead && touched.assignmentToLead ? "red.300" : null}
        //                                     >
        //                                         {assignmentToData?.map((item) => {
        //                                             return <option value={item._id} key={item._id}>{values.category === 'Lead' && item.leadName}</option>
        //                                         })}
        //                                     </Select>
        //                                     <IconButton onClick={() => setLeadModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
        //                                 </Flex>
        //                                 <Text mb='10px' color={'red'}> {errors.assignmentToLead && touched.assignmentToLead && errors.assignmentToLead}</Text>
        //                             </GridItem>
        //                         </>
        //                         : ''
        //                 }
        //                 <GridItem colSpan={{ base: 12 }} >
        //                     <Checkbox isChecked={isChecked}
        //                         name="allDay"
        //                         onChange={(e) => {
        //                             setFieldValue('allDay', e.target.checked === true ? 'Yes' : 'No');
        //                             setIsChecked(e.target.checked);
        //                         }}
        //                     >All Day Task ? </Checkbox>
        //                 </GridItem>
        //                 <GridItem colSpan={{ base: 12, md: 6 }} >
        //                     <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                         Start Date<Text color={"red"}>*</Text>
        //                     </FormLabel>
        //                     <Input
        //                         type={isChecked ? 'date' : 'datetime-local'}
        //                         fontSize='sm'
        //                         onChange={handleChange}
        //                         onBlur={handleBlur}
        //                         value={values.start}
        //                         name="start"
        //                         fontWeight='500'
        //                         borderColor={errors?.start && touched?.start ? "red.300" : null}
        //                     />
        //                     <Text mb='10px' fontSize='sm' color={'red'}> {errors.start && touched.start && errors.start}</Text>
        //                 </GridItem>
        //                 <GridItem colSpan={{ base: 12, md: 6 }} >
        //                     <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                         End Date
        //                     </FormLabel>
        //                     <Input
        //                         type={isChecked ? 'date' : 'datetime-local'}
        //                         fontSize='sm'
        //                         min={values.start}
        //                         onChange={handleChange}
        //                         onBlur={handleBlur}
        //                         value={values.end}
        //                         name="end"
        //                         fontWeight='500'
        //                         borderColor={errors?.end && touched?.end ? "red.300" : null}
        //                     />
        //                     <Text mb='10px' color={'red'}> {errors.end && touched.end && errors.end}</Text>
        //                 </GridItem>
        //                 <GridItem colSpan={{ base: 12, sm: 4 }} >
        //                     <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                         Background-Color
        //                     </FormLabel>
        //                     <Input
        //                         type='color'
        //                         fontSize='sm'
        //                         onChange={handleChange}
        //                         onBlur={handleBlur}
        //                         value={values.backgroundColor}
        //                         name="backgroundColor"
        //                         fontWeight='500'
        //                         borderColor={errors?.backgroundColor && touched?.backgroundColor ? "red.300" : null}
        //                     />
        //                     <Text mb='10px' color={'red'}> {errors.backgroundColor && touched.backgroundColor && errors.backgroundColor}</Text>
        //                 </GridItem>
        //                 <GridItem colSpan={{ base: 12, sm: 4 }} >
        //                     <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                         Border-Color
        //                     </FormLabel>
        //                     <Input
        //                         fontSize='sm'
        //                         type='color'
        //                         onChange={handleChange}
        //                         onBlur={handleBlur}
        //                         value={values.borderColor}
        //                         name="borderColor"
        //                         placeholder='borderColor'
        //                         fontWeight='500'
        //                         borderColor={errors?.borderColor && touched?.borderColor ? "red.300" : null}
        //                     />
        //                     <Text mb='10px' color={'red'}> {errors.borderColor && touched.borderColor && errors.borderColor}</Text>
        //                 </GridItem>
        //                 <GridItem colSpan={{ base: 12, sm: 4 }} >
        //                     <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                         Text-Color
        //                     </FormLabel>
        //                     <Input
        //                         fontSize='sm'
        //                         type='color'
        //                         onChange={handleChange}
        //                         onBlur={handleBlur}
        //                         value={values.textColor}
        //                         name="textColor"
        //                         placeholder='textColor'
        //                         fontWeight='500'
        //                         textColor={errors?.textColor && touched?.textColor ? "red.300" : null}
        //                     />
        //                     <Text mb='10px' color={'red'}> {errors.textColor && touched.textColor && errors.textColor}</Text>
        //                 </GridItem>
        //                 <GridItem colSpan={{ base: 12 }} >
        //                     <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                         Url
        //                     </FormLabel>
        //                     <Input
        //                         fontSize='sm'
        //                         onChange={handleChange}
        //                         onBlur={handleBlur}
        //                         value={values.url}
        //                         name="url"
        //                         placeholder='Enter url'
        //                         fontWeight='500'
        //                         borderColor={errors?.url && touched?.url ? "red.300" : null}
        //                     />
        //                     <Text mb='10px' color={'red'}> {errors.url && touched.url && errors.url}</Text>
        //                 </GridItem>

        //                 <GridItem colSpan={{ base: 12 }} >
        //                     <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
        //                         Notes
        //                     </FormLabel>
        //                     <Textarea
        //                         resize={'none'}
        //                         fontSize='sm'
        //                         onChange={handleChange}
        //                         onBlur={handleBlur}
        //                         value={values.notes}
        //                         name="notes"
        //                         placeholder='Notes'
        //                         fontWeight='500'
        //                         borderColor={errors?.notes && touched?.notes ? "red.300" : null}
        //                     />
        //                     <Text mb='10px' color={'red'}> {errors.notes && touched.notes && errors.notes}</Text>
        //                 </GridItem>
        //             </Grid>

        //         </ModalBody>
        //         <ModalFooter>
        //             <Button size="sm" variant='brand' disabled={isLoding ? true : false} onClick={handleSubmit}>{isLoding ? <Spinner /> : 'Save'}</Button>
        //             <Button sx={{
        //                 marginLeft: 2,
        //                 textTransform: "capitalize",
        //             }} variant="outline"
        //                 colorScheme="red" size="sm" onClick={() => {
        //                     formik.resetForm()
        //                     onClose()
        //                 }}>Close</Button>
        //         </ModalFooter>
        //     </ModalContent>
        // </Modal>
        <Modal isOpen={isOpen} size={'xl'} >
            {!props.from && <ModalOverlay />}
            <ModalContent overflowY={"auto"} height={"600px"}>
                <ModalHeader justifyContent='space-between' display='flex' >
                    {
                        userAction == "add" ? "Create Task" : "Edit Task"
                    }

                    <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
                </ModalHeader>
                <ModalBody overflowY={"auto"} height={"700px"}>
                    {/* Contact Model  */}
                    <ContactModel isOpen={contactModelOpen} data={assignmentToData} onClose={setContactModel} values={values} fieldName='assignmentTo' setFieldValue={setFieldValue} />
                    {/* Lead Model  */}
                    <LeadModel isOpen={leadModelOpen} data={assignmentToData} onClose={setLeadModel} values={values} fieldName='assignmentToLead' setFieldValue={setFieldValue} />
                    {isLoding ?
                        <Flex justifyContent={'center'} alignItems={'center'} width="100%" >
                            <Spinner />
                        </Flex>
                        :
                        <Grid templateColumns="repeat(12, 1fr)" gap={3} >
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Title<Text color={"red"}>*</Text>
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                    name="title"
                                    placeholder='Title'
                                    fontWeight='500'
                                    borderColor={errors?.title && touched?.title ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'} fontSize='sm'> {errors.title && touched.title && errors.title}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Related
                                </FormLabel>
                                <RadioGroup onChange={(e) => { setFieldValue('category', e); setFieldValue('assignmentTo', null); setFieldValue('assignmentToLead', null); }} value={values.category}>
                                    <Stack direction='row'>
                                        <Radio value='None' >None</Radio>
                                        {props.leadContect === 'contactView' && <Radio value='Contact'>Contact</Radio>}
                                        {props.leadContect === 'leadView' && <Radio value='Lead'>Lead</Radio>}
                                        {!props.leadContect && <> <Radio value='Contact'>Contact</Radio><Radio value='Lead'>Lead</Radio></>}
                                    </Stack>
                                </RadioGroup>
                                <Text mb='10px' color={'red'}> {errors.category && touched.category && errors.category}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: values.category === "None" ? 12 : 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Description
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                    name="description"
                                    placeholder='Description'
                                    fontWeight='500'
                                    borderColor={errors?.description && touched?.description ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.description && touched.description && errors.description}</Text>
                            </GridItem>
                            {values.category === "Contact" ?
                                <>
                                    <GridItem colSpan={{ base: 12, md: 6 }} >
                                        <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                            Assignment To  Contact
                                        </FormLabel>
                                        <Flex justifyContent={'space-between'}>
                                            <Select
                                                value={values.assignmentTo}
                                                name="assignmentTo"
                                                onChange={handleChange}
                                                mb={errors.assignmentTo && touched.assignmentTo ? undefined : '10px'}
                                                fontWeight='500'
                                                placeholder={'Assignment To'}
                                                borderColor={errors.assignmentTo && touched.assignmentTo ? "red.300" : null}
                                            >
                                                {assignmentToData?.map((item) => {
                                                    return <option value={item._id} key={item._id}>{values.category === 'Contact' ? `${item.firstName} ${item.lastName}` : item.leadName}</option>
                                                })}
                                            </Select>
                                            <IconButton onClick={() => setContactModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                        </Flex>
                                        <Text mb='10px' color={'red'}> {errors.assignmentTo && touched.assignmentTo && errors.assignmentTo}</Text>
                                    </GridItem>
                                </>
                                : values.category === "Lead" ?
                                    <>
                                        <GridItem colSpan={{ base: 12, md: 6 }} >
                                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                                Assignment To Lead
                                            </FormLabel>
                                            <Flex justifyContent={'space-between'}>
                                                <Select
                                                    value={values.assignmentToLead}
                                                    name="assignmentToLead"
                                                    onChange={handleChange}
                                                    mb={errors.assignmentToLead && touched.assignmentToLead ? undefined : '10px'}
                                                    fontWeight='500'
                                                    placeholder={'Assignment To'}
                                                    borderColor={errors.assignmentToLead && touched.assignmentToLead ? "red.300" : null}
                                                >
                                                    {assignmentToData?.map((item) => {
                                                        return <option value={item._id} key={item._id}>{item.leadName}</option>
                                                    })}
                                                </Select>
                                                <IconButton onClick={() => setLeadModel(true)} ml={2} fontSize='25px' icon={<LiaMousePointerSolid />} />
                                            </Flex>
                                            <Text mb='10px' color={'red'}> {errors.assignmentToLead && touched.assignmentToLead && errors.assignmentToLead}</Text>
                                        </GridItem>
                                    </>
                                    : ''
                            }
                            <GridItem colSpan={{ base: 12 }} >
                                <Checkbox isChecked={isChecked} name='allDay'
                                    onChange={(e) => {
                                        const target = e.target.checked;
                                        setFieldValue('allDay', e.target.checked === true ? 'Yes' : 'No');
                                        setIsChecked(target);
                                    }}>
                                    All Day Task ?
                                </Checkbox>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Start Date
                                </FormLabel>
                                {console.log(values.start)}
                                <Input
                                    type={isChecked === true ? 'date' : 'datetime-local'}
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    // min={isChecked === true ? today : todayTime}
                                    value={isChecked ? moment(values.start).format('YYYY-MM-DD') || '' : moment(values.start).format('YYYY-MM-DDTHH:mm') || ''}
                                    name="start"
                                    fontWeight='500'
                                    borderColor={errors?.start && touched?.start ? "red.300" : null}
                                />
                                <Text mb='10px' fontSize='sm' color={'red'}> {errors.start && touched.start && errors.start}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    End Date
                                </FormLabel>
                                <Input
                                    type={isChecked === true ? 'date' : 'datetime-local'}
                                    min={values.start}
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={isChecked ? moment(values.end).format('YYYY-MM-DD') || '' : moment(values.end).format('YYYY-MM-DDTHH:mm') || ''}
                                    name="end"
                                    fontWeight='500'
                                    borderColor={errors?.end && touched?.end ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.end && touched.end && errors.end}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 4 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Background-Color
                                </FormLabel>
                                <Input
                                    type='color'
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.backgroundColor}
                                    name="backgroundColor"
                                    fontWeight='500'
                                    borderColor={errors?.backgroundColor && touched?.backgroundColor ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.backgroundColor && touched.backgroundColor && errors.backgroundColor}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 4 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Border-Color
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    type='color'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.borderColor}
                                    name="borderColor"
                                    placeholder='borderColor'
                                    fontWeight='500'
                                    borderColor={errors?.borderColor && touched?.borderColor ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.borderColor && touched.borderColor && errors.borderColor}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, sm: 4 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Text-Color
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    type='color'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.textColor}
                                    name="textColor"
                                    placeholder='textColor'
                                    fontWeight='500'
                                    textColor={errors?.textColor && touched?.textColor ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.textColor && touched.textColor && errors.textColor}</Text>
                            </GridItem>


                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Url
                                </FormLabel>
                                <Input
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.url}
                                    name="url"
                                    placeholder='Enter url'
                                    fontWeight='500'
                                    borderColor={errors?.url && touched?.url ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.url && touched.url && errors.url}</Text>
                            </GridItem>
                            <GridItem colSpan={{ base: 12, md: 6 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Status
                                </FormLabel>
                                <Select
                                    onChange={(e) => setFieldValue("status", e.target.value)}
                                    value={values?.status}
                                    style={{ fontSize: "14px" }}>
                                    <option value='completed'>Completed</option>
                                    <option value='todo'>Todo</option>
                                    <option value='onHold'>On Hold</option>
                                    <option value='inProgress'>In Progress</option>
                                    <option value='pending'>Pending</option>
                                </Select>
                            </GridItem>
                            <GridItem colSpan={{ base: 12 }} >
                                <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                    Notes
                                </FormLabel>
                                <Textarea
                                    resize={'none'}
                                    fontSize='sm'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.notes}
                                    name="notes"
                                    placeholder='Notes'
                                    fontWeight='500'
                                    borderColor={errors?.notes && touched?.notes ? "red.300" : null}
                                />
                                <Text mb='10px' color={'red'}> {errors.notes && touched.notes && errors.notes}</Text>
                            </GridItem>
                        </Grid>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button size="sm" variant='brand' onClick={handleSubmit}>{userAction === "add" ? "Save" : "Update"}</Button>
                    <Button type="reset" sx={{
                        marginLeft: 2,
                        textTransform: "capitalize",
                    }} variant="outline"
                        colorScheme="red" size="sm" ml={2} onClick={() => onClose(false)}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddEdit
