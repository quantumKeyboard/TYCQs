import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BaseChapter {
  chapterId: string;
  title: string;
  description: string;
  questions: BaseQuestion[];
}

interface ETIChapter extends BaseChapter {
  questions: ETIQuestion[];
}

interface MGTChapter extends BaseChapter {
  learningObjectives: string[];
  questions: MGTQuestion[];
}

interface BaseQuestion {
  id: string;
  text: string;
  options: Option[];
}

interface ETIQuestion extends BaseQuestion {
  explanation: string;
  tags: string[];
}

interface MGTQuestion extends BaseQuestion {
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

const AdminPanel: React.FC = () => {
  const [chapters, setChapters] = useState<(ETIChapter | MGTChapter)[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadChapters();
  }, []);

  const createManifestFile = () => {
    const manifestContent = JSON.stringify({ chapters: [] }, null, 2);
    const blob = new Blob([manifestContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadChapters = async () => {
    try {
      // Load chapters from the public/chapters directory
      const response = await fetch('/chapters/manifest.json');
      if (!response.ok) {
        // If manifest doesn't exist, create an empty array
        setChapters([]);
        toast({
          title: 'Manifest file not found',
          description: 'Please create a manifest.json file in the public/chapters directory.',
          action: (
            <Button onClick={createManifestFile}>
              Download Manifest Template
            </Button>
          ),
        });
        return;
      }
      const manifest = await response.json();
      setChapters(manifest.chapters || []);
    } catch (error) {
      console.error('Error loading chapters:', error);
      setChapters([]);
    }
  };

  const validateETIChapter = (data: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!data) {
      errors.push('Chapter data is empty');
      return { isValid: false, errors };
    }

    if (typeof data.chapterId !== 'string' || !data.chapterId.startsWith('eti-')) {
      errors.push('Invalid chapter ID format. Must start with "eti-"');
    }
    
    if (typeof data.title !== 'string') {
      errors.push('Title is required and must be a string');
    }
    
    if (typeof data.description !== 'string') {
      errors.push('Description is required and must be a string');
    }
    
    if (!Array.isArray(data.questions)) {
      errors.push('Questions must be an array');
    } else {
      data.questions.forEach((q: any, index: number) => {
        if (!q.id || !q.id.startsWith('eti-')) {
          errors.push(`Question ${index + 1}: Invalid question ID format`);
        }
        if (!q.text) {
          errors.push(`Question ${index + 1}: Question text is required`);
        }
        if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4) {
          errors.push(`Question ${index + 1}: Must have 2-4 options`);
        } else {
          q.options.forEach((o: any, optIndex: number) => {
            if (!o.id || !o.id.startsWith('eti-')) {
              errors.push(`Question ${index + 1}, Option ${optIndex + 1}: Invalid option ID format`);
            }
            if (!o.text) {
              errors.push(`Question ${index + 1}, Option ${optIndex + 1}: Option text is required`);
            }
            if (typeof o.isCorrect !== 'boolean') {
              errors.push(`Question ${index + 1}, Option ${optIndex + 1}: isCorrect must be a boolean`);
            }
          });
        }
        if (!q.explanation) {
          errors.push(`Question ${index + 1}: Explanation is required`);
        }
        if (!Array.isArray(q.tags)) {
          errors.push(`Question ${index + 1}: Tags must be an array`);
        }
      });
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateMGTChapter = (data: any): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!data) {
      errors.push('Chapter data is empty');
      return { isValid: false, errors };
    }

    if (typeof data.chapterId !== 'string' || !data.chapterId.startsWith('mgt-')) {
      errors.push('Invalid chapter ID format. Must start with "mgt-"');
    }
    
    if (typeof data.title !== 'string') {
      errors.push('Title is required and must be a string');
    }
    
    if (typeof data.description !== 'string') {
      errors.push('Description is required and must be a string');
    }
    
    if (!Array.isArray(data.learningObjectives)) {
      errors.push('Learning objectives must be an array');
    }
    
    if (!Array.isArray(data.questions)) {
      errors.push('Questions must be an array');
    } else {
      data.questions.forEach((q: any, index: number) => {
        if (!q.id || !q.id.startsWith('mgt-')) {
          errors.push(`Question ${index + 1}: Invalid question ID format`);
        }
        if (!q.text) {
          errors.push(`Question ${index + 1}: Question text is required`);
        }
        if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4) {
          errors.push(`Question ${index + 1}: Must have 2-4 options`);
        } else {
          q.options.forEach((o: any, optIndex: number) => {
            if (!o.id || !o.id.startsWith('mgt-')) {
              errors.push(`Question ${index + 1}, Option ${optIndex + 1}: Invalid option ID format`);
            }
            if (!o.text) {
              errors.push(`Question ${index + 1}, Option ${optIndex + 1}: Option text is required`);
            }
            if (typeof o.isCorrect !== 'boolean') {
              errors.push(`Question ${index + 1}, Option ${optIndex + 1}: isCorrect must be a boolean`);
            }
          });
        }
        if (!q.category) {
          errors.push(`Question ${index + 1}: Category is required`);
        }
        if (!['basic', 'intermediate', 'advanced'].includes(q.difficulty)) {
          errors.push(`Question ${index + 1}: Difficulty must be basic, intermediate, or advanced`);
        }
      });
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setUploadError(null);
  };

  const updateManifestFile = (chapterData: any) => {
    // Create a download link for the updated manifest file
    const manifestContent = JSON.stringify({
      chapters: [...chapters, chapterData]
    }, null, 2);
    const blob = new Blob([manifestContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      console.log('Starting file upload process...');
      const content = await selectedFile.text();
      console.log('File content read successfully');
      
      const chapterData = JSON.parse(content);
      console.log('JSON parsed successfully:', chapterData);
      
      // Determine chapter type and validate accordingly
      const validation = chapterData.chapterId.startsWith('eti-') 
        ? validateETIChapter(chapterData)
        : validateMGTChapter(chapterData);

      console.log('Validation result:', validation);

      if (!validation.isValid) {
        setUploadError(validation.errors.join('\n'));
        return;
      }

      // Create a download link for the chapter file
      const blob = new Blob([JSON.stringify(chapterData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chapterData.chapterId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Create a download link for the updated manifest file
      updateManifestFile(chapterData);
      
      toast({
        title: 'Success',
        description: 'Chapter file and updated manifest downloaded successfully. Please save them to the public/chapters directory.',
      });
      
      setSelectedFile(null);
      loadChapters();
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof SyntaxError) {
        setUploadError('Invalid JSON format. Please check your file.');
      } else {
        setUploadError(`Failed to process chapter file: ${error.message}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadChapter = (chapter: ETIChapter | MGTChapter) => {
    const dataStr = JSON.stringify(chapter, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chapter.chapterId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return;

    // Create a download link for the updated manifest file
    const updatedChapters = chapters.filter(c => c.chapterId !== chapterId);
    const manifestContent = JSON.stringify({
      chapters: updatedChapters
    }, null, 2);
    const blob = new Blob([manifestContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Instructions',
      description: `Please delete the file ${chapterId}.json from the public/chapters directory and replace the manifest.json with the downloaded file.`,
    });
    
    // Refresh the chapter list
    loadChapters();
  };

  const isETIChapter = (chapter: ETIChapter | MGTChapter): chapter is ETIChapter => {
    return chapter.chapterId.startsWith('eti-');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Upload Chapter</h2>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="max-w-md"
                />
                <Button 
                  variant="outline" 
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
              
              {uploadError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription className="whitespace-pre-line">
                    {uploadError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">File Format Requirements:</h3>
                <div className="space-y-2 text-sm">
                  <p>1. File must be a valid JSON file</p>
                  <p>2. Chapter ID must start with either "eti-" or "mgt-"</p>
                  <p>3. Required fields for all chapters:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>chapterId (string)</li>
                    <li>title (string)</li>
                    <li>description (string)</li>
                    <li>questions (array)</li>
                  </ul>
                  <p>4. Each question must have:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>id (string starting with chapter prefix)</li>
                    <li>text (string)</li>
                    <li>options (array of 2-4 options)</li>
                  </ul>
                  <p>5. Each option must have:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>id (string starting with chapter prefix)</li>
                    <li>text (string)</li>
                    <li>isCorrect (boolean)</li>
                  </ul>
                  <p>6. Additional requirements:</p>
                  <ul className="list-disc list-inside ml-4">
                    <li>ETI chapters: Each question needs explanation and tags</li>
                    <li>MGT chapters: Each question needs category and difficulty level</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Manage Chapters</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {chapters.map((chapter) => (
                  <Card key={chapter.chapterId}>
                    <CardHeader>
                      <CardTitle className="text-base">{chapter.title}</CardTitle>
                      <div className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary w-fit">
                        {chapter.chapterId.startsWith('eti-') ? 'ETI' : 'MGT'}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {chapter.description}
                      </p>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDownloadChapter(chapter)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={() => handleDeleteChapter(chapter.chapterId)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel; 