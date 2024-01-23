import { ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Menu, Heading, MenuButton, Select, Checkbox, GridItem, Text, MenuItem, Grid, MenuList, FormLabel, Input } from '@chakra-ui/react';
import Card from 'components/card/Card'
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import Addfield from './addfield'
import { getApi } from 'services/api';
import EditField from './editfield';
import DeleteFiled from './deletefield';

const CustomField = () => {
    const [addFieldModel, setAddFieldModel] = useState(false);
    const [moduleName, setModuleName] = useState('')
    const [data, setData] = useState([])
    const [fields, setFields] = useState([])
    const [editModal, setEditModal] = useState(false)
    const [updateField, setUpdateField] = useState({})
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteMany, setDeleteMany] = useState(false)
    const [selectedValues, setSelectedValues] = useState([]);
    const [selectedId, setSelectedId] = useState('')

    // const fields = [
    //     {
    //         id: 1,
    //         name: 'lead',
    //         fields: [{
    //             name: 'name',
    //             label: 'Name',
    //             type: 'text',
    //             validation: [
    //                 { require: true, message: 'Please Enter Name' },
    //                 { min: true, value: 0, message: '' },
    //                 { max: true, value: 10, message: '' },
    //                 { match: true, value: '/^\d{10}$/', message: '' }
    //             ]
    //         }, {
    //             name: 'name',
    //             label: 'Name',
    //             type: 'text',
    //             validation: [
    //                 { require: true, message: 'Please Enter Name' },
    //                 { min: true, value: 0, message: '' },
    //                 { max: true, value: 10, message: '' },
    //                 { match: true, value: '/^\d{10}$/', message: '' }
    //             ]
    //         }]
    //     },
    //     {
    //         id: 2,
    //         name: 'contact',
    //         fields: [{
    //             name: 'fieldname',
    //             label: 'Name',
    //             type: 'text',
    //             validation: [
    //                 { require: true, message: 'Please Enter Name' },
    //                 { min: true, value: 0, message: '' },
    //                 { max: true, value: 10, message: '' },
    //                 { match: true, value: '/^\d{10}$/', message: '' }
    //             ]
    //         }, {
    //             name: 'name',
    //             label: 'Name',
    //             type: 'text',
    //             validation: [
    //                 { require: true, message: 'Please Enter Name' },
    //                 { min: true, value: 0, message: '' },
    //                 { max: true, value: 10, message: '' },
    //                 { match: true, value: '/^\d{10}$/', message: '' }
    //             ]
    //         },
    //         ]
    //     },
    // ];
    // const formik = useFormik({
    //     initialValues: {
    //         // Set initial values based on your form fields
    //         name: '',
    //         // Add more fields as needed
    //     },
    //     validate: (values) => {
    //         const errors = {};

    //         fields.forEach((field) => {
    //             const { name, validation } = field;

    //             validation.forEach(({ require, min, max, match, value, message }) => {
    //                 const fieldValue = values[name];

    //                 if (require && !fieldValue) {
    //                     errors[name] = message;
    //                 } else if (min && fieldValue.length < min) {
    //                     errors[name] = message;
    //                 } else if (max && fieldValue.length > max) {
    //                     errors[name] = message;
    //                 } else if (match && value instanceof RegExp && fieldValue && !fieldValue.match(value)) {
    //                     errors[name] = message;
    //                 }
    //             });
    //         });

    //         return errors;
    //     },
    //     onSubmit: (values) => {
    //         // Handle form submission
    //         console.log('Form values:', values);
    //     },
    // });


    const handleCheckboxChange = (event, value) => {
        if (event.target.checked) {
            setSelectedValues((prevSelectedValues) => [...prevSelectedValues, value]);
        } else {
            setSelectedValues((prevSelectedValues) =>
                prevSelectedValues.filter((selectedValue) => selectedValue !== value)
            );
        }
    };

    const fetchData = async () => {
        let responseAllData = await getApi(`api/custom-field`);
        setFields(responseAllData?.data);
        if (moduleName) {
            let response = await getApi(`api/custom-field/?moduleName=${moduleName}`);
            setData(response?.data);
        } else if (!moduleName) {
            setData([])
        }
    }
    useEffect(() => {
        if (fetchData) fetchData()
    }, [moduleName])

    const initialValues = {
        name: '',
        label: '',
        type: '', require: false, message: '',
        min: false, minValue: '', minMessage: '',
        max: false, maxValue: '', maxMessage: '',
        match: false, matchValue: '', matchMessage: '',
    }

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            console.log('Form values:', values);
        },
    })

    const { values, handleSubmit, handleChange, handleBlur, touched, errors } = formik;

    return (
        <>
            <Card>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Box >
                        <Text color={"secondaryGray.900"}
                            fontSize="22px"
                            fontWeight="700"
                        >Custom Field</Text>
                        {/* {selectedValues.length > 0 && <DeleteIcon onClick={() => setDeleteMany(true)} color={'red'} ms={2} />} */}
                    </Box>
                    <Box>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline">
                                {moduleName ? moduleName : 'Select Module'}
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => setModuleName('')}>Select Module</MenuItem>
                                {fields?.map((item, id) => (
                                    <MenuItem key={id} onClick={() => setModuleName(item.moduleName)}>{item.moduleName}</MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Box>
                </Flex>
                <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={5}>
                    {data[0]?.fields?.map((item, i) => (
                        <GridItem colSpan={{ base: 12, md: 6 }}>
                            <Flex alignItems={"center"} justifyContent={"space-between"} className="CustomFieldName" >
                                <Text display='flex' size='sm' colorScheme='gray' ms='4px' mt={4} fontSize='md' fontWeight='500' mb='8px' >
                                    <Checkbox colorScheme="brandScheme" value={selectedValues} isChecked={selectedValues.includes(item?._id)} onChange={(event) => handleCheckboxChange(event, item?._id)} me="10px" />
                                    {item?.label}
                                </Text>
                                <span className="EditDelete">
                                    <Button size='sm' variant='outline' me={2} color={'green'} onClick={() => { setEditModal(true); setUpdateField(item) }}><EditIcon /></Button>
                                    <Button size='sm' variant='outline' me={2} color={'red'} onClick={() => { setDeleteModal(true); setSelectedId(item?._id) }}><DeleteIcon /></Button>
                                </span>
                            </Flex>
                        </GridItem>
                    ))}
                </Grid>
                <Flex justifyContent={'end'} mt='5'>
                    {selectedValues.length > 0 && <Button colorScheme="red" mr={2} onClick={() => setDeleteMany(true)} size='sm' >Delete</Button>}

                    {data?.length > 0 && <Button onClick={() => setAddFieldModel(true)} variant="brand" size='sm'>Add Field</Button>}
                </Flex>
            </Card>

            <Addfield isOpen={addFieldModel} onClose={setAddFieldModel} moduleName={moduleName} field={data[0]?.fields} moduleId={data[0]?._id} fetchData={fetchData} />
            <EditField isOpen={editModal} onClose={setEditModal} field={data[0]?.fields} moduleId={data[0]?._id} fetchData={fetchData} updateFiled={updateField} />
            <DeleteFiled method='one' isOpen={deleteModal} onClose={setDeleteModal} moduleName={moduleName} moduleId={data[0]?._id} selectedId={selectedId} fetchData={fetchData} updateFiled={updateField} />
            <DeleteFiled method='many' isOpen={deleteMany} onClose={setDeleteMany} url={'api/custom-field/deleteMany'} moduleName={moduleName} moduleId={data[0]?._id} selectedId={selectedId} fetchData={fetchData} updateFiled={updateField} setSelectedValues={setSelectedValues} data={selectedValues} />

        </>
    )
}

export default CustomField