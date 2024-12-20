DROP DATABASE IF EXISTS phonics_db;
CREATE DATABASE phonics_db;

USE phonics_db;

INSERT INTO lessons (id, title, summary, term1, definition1, example1, term2, definition2, example2, term3, definiton3, example3, term4, definition4, example4) 
VALUES 
(1, 'Consonants & Vowels', 'Words are created by combining and arranging letters into existing patterns.  Therefore, an awareness of letters and patterns can be helpful for early readers.  Letters are  organized into two groups based on their sounds.', 'Consonants', 'A letter other than A, E, I, O, and U, can be combined with other consonants and vowels to form more complex patterns.','all_consonants', 'Vowels:', ' The letters A, E, I, O, and U are called vowels.  Vowels have a long sound and a short sound.', 'all_vowels',  'Long Vowels:', 'The long sound is the vowel\'s name.', 'all_long_vowels', 'Short Vowels:', 'The short vowel sound is unique for each letter and should be memorized.' ,'all_short_vowels' ), 
(2, 'CV-VC Sounds & High Frequency Words'),
(3, 'CVC'),
(4, 'Consonants & Vowels'),
(5, 'Consonant Blends');

INSERT INTO exercises (id, name, lessonId) 
VALUES 
(1, 'Exercise1.1', 1),
(2, 'Exercise1.2', 2),
(3, 'Exercise1.3', 3);

INSERT INTO lessons (id, instruction, category, image, hint, objectType, ElementType, exerciseId)
VALUES
(1, 'Select all the vowels.', 'letters', false, '', 'text', 'checkbox', 1),
(2, 'Select the pictures that make the short vowel sound.', 'phonics', true, '', 'text', 'checkbox', 2),
(3, 'Fill in the blank with the letter of the first sound of the picture below.', 'firstLetter', true, '', 'text', 'fillin', 3);



'--NOTE: The computer will pull a random number of images to display as choices in the choices component'
INSERT INTO choices (id, text, category, number, url, lessonId)
VALUES
(1, '', 'letters', 26, '', 1),
(2, '', 'short_vowel', 10, 'https://cloudinary/phonics/', 2),
(3, '', 'first_letter', 15, 'https://cloudinary/first_letter/', 3);

-- each category will have a matching answer to check
INSERT INTO images 
(id, text, category1, category2, category3, category4, ,category5, category6, syllables, url, imageName, answer1, answer2, answer3, answer4, answer5, answer6. choiceId)
VALUES
(1, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'a', true, true, 'a', true, false, false, 1),
(2, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'b', true, true, 'b', false, false, false, 1),
(3, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'c', true, true, 'c', false, false, false, 1),
(4, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'd', true, true, 'd', false, false, false, 1),
(5, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'e', true, true, 'e', true, false, false, 1),
(6, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'f', true, true, 'f', false, false, false, 1),
(7, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'g', true, true, 'g', false, false, false, 1),
(8, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'h', true, true, 'h', false, false, false, 1),
(9, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'i', true, true, 'i', false, false, false, 1),
(10, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'j', true, true, 'j', false, false, false, 1),

(11, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'k', true, true, 'k', false, false, false, 1),
(12, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'l', true, true, 'l', false, false, false, 1),
(13, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'm', true, true, 'm', false, false, false, 1),
(14, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'n', true, true, 'n', false, false, false, 1),
(15, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'o', true, true, 'o', false, false, false, 1),
(16, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'p', true, true, 'p', false, false, false, 1),
(17, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'q', true, true, 'q', false, false, false, 1),
(18, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'r', true, true, 'r', false, false, false, 1),
(19, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 's', true, true, 's', false, false, false, 1),
(20, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 't', true, true, 't', false, false, false, 1),
(21, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','','u', true, true, 'u', false, false, false, 1),
(22, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'v', true, true, 'v', false, false, false, 1),
(23, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'w', true, true, 'w', false, false, false, 1),
(24, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'x', true, true, 'x', false, false, false, 1),
(25, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'y', true, true, 'y', false, false, false, 1),
(26, '', 'letter', 'consonant', 'first', 'vowel', 'short', 'long', '','', 'z', true, true, 'z', false, false, false, 1),

(27, '', 'word', 'vowel', 'short', 'ph', 3, 'https://cloudinary/', '', 'elephant', true, 2),
(28, '', 'word', 'vowel', 'short', '', 3, 'https://cloudinary/', '', 'octopus', true, 2),
(29, '', 'word', 'vowel', 'short', 'le', 2, 'https://cloudinary/', '', 'apple', true, 2),
(30, '', 'word', 'vowel', 'short', 'br', 3, 'https://cloudinary/', '', 'umbrella', true, 2),
(31, '', 'word', 'vowel', 'short', 'gl, oo', 2, 'https://cloudinary/', '', 'igloo', true, 2),
(32, '', 'word', 'vowel', 'short', 'ck', 1, 'https://cloudinary/', '', 'duck', 'd', 3),
(46, '', 'word', 'vowel', 'short', 'ck', 1, 'https://cloudinary/', '', 'duck', 'd', 3);
--Answers Table: where images join answers by imageId, If answer.category EQ images[`${answer.image_category}`] and answer.selection EQ images[answers.image_answer] then assesment is true, else false;  The component needs to pull the image choices based on choices table and evaluate the user's selection, and store the assessment in the table.
INSERT INTO answers (id, image_category, image_answer, selection, assessment, imagesId)
VALUES
(1, category4, answer4, true, 1);