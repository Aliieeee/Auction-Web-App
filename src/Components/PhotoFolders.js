import React, { useEffect, useState } from 'react';
import { storage } from '../firebaseConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import JSZip from 'jszip';

import '@fortawesome/fontawesome-free/css/all.min.css';

function PhotoFolders() {
    const [folders, setFolders] = useState([]);
    const [loadingFolder, setLoadingFolder] = useState(null);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const storageRef = ref(storage, 'photosFolder');
                const result = await listAll(storageRef);

                const folderNames = result.prefixes.map(folderRef => folderRef.name);
                setFolders(folderNames);
            } catch (error) {
                console.error('Error fetching folders: ', error);
            }
        };

        fetchFolders();
    }, []);

    const downloadFolder = async (folderName) => {
        setLoadingFolder(folderName);
        try {
            const folderRef = ref(storage, `photosFolder/${folderName}`);
            const result = await listAll(folderRef);

            const zip = new JSZip();
            const folderZip = zip.folder(folderName);

            for (const fileRef of result.items) {
                const url = await getDownloadURL(fileRef);
                const response = await fetch(url, {
                    mode: 'cors'
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${fileRef.name}`);
                }
                const blob = await response.blob();
                folderZip.file(fileRef.name, blob);
                console.log(`Added file: ${fileRef.name}`);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = `${folderName}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            console.log(`Downloaded ZIP file for folder: ${folderName}`);
        } catch (error) {
            console.error('Error downloading folder: ', error);
        } finally {
            setLoadingFolder(null);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Photo Folders</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b-2 border-gray-200 bg-blue-400">Folder Name</th>
                        <th className="px-4 py-2 border-b-2 border-gray-200 bg-blue-400">Download</th>
                    </tr>
                </thead>
                <tbody>
                    {folders.map(folder => (
                        <tr key={folder} className="hover:bg-gray-100">
                            <td className="px-4 py-2 border-b border-gray-200">{folder}</td>
                            <td className="px-4 py-2 border-b border-gray-200 text-center">
                                {loadingFolder === folder ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                    <i
                                        className="fas fa-download cursor-pointer text-blue-500"
                                        onClick={() => downloadFolder(folder)}
                                    ></i>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PhotoFolders;
